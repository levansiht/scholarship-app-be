import { Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '../../../common';
import { DeleteDocumentCommand } from './delete-document.command';
import {
  SCHOLARSHIP_DOCUMENT_REPOSITORY,
  IScholarshipDocumentRepository,
} from '../../../../domain/interfaces/repositories';
import { SupabaseService } from '../../../../../infras/storage/supabase/supabase.service';

@CommandHandler(DeleteDocumentCommand)
export class DeleteDocumentCommandHandler extends BaseCommandHandler<
  DeleteDocumentCommand,
  void
> {
  constructor(
    @Inject(SCHOLARSHIP_DOCUMENT_REPOSITORY)
    private readonly documentRepository: IScholarshipDocumentRepository,
    private readonly supabaseService: SupabaseService,
  ) {
    super();
  }

  async execute(command: DeleteDocumentCommand): Promise<void> {
    const { documentId, scholarshipId } = command;

    // Find document
    const document = await this.documentRepository.findById(documentId);
    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    // Verify document belongs to the scholarship
    if (document.scholarshipId !== scholarshipId) {
      throw new ForbiddenException(
        'Document does not belong to this scholarship',
      );
    }

    // Delete file from Supabase
    await this.supabaseService.deleteFile(document.fileUrl);

    // Delete document record from database
    await this.documentRepository.delete(documentId);
  }
}
