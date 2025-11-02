import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { UploadApplicationDocumentsCommand } from './upload-documents.command';
import type { IRepositoryApplication } from '../../../../domain/interfaces/repositories/application.repository.interface';
import { APPLICATION_REPOSITORY } from '../../../../domain/interfaces/repositories/application.repository.interface';
import { SupabaseService } from '../../../../../infras/storage/supabase/supabase.service';

@Injectable()
@CommandHandler(UploadApplicationDocumentsCommand)
export class UploadApplicationDocumentsHandler {
  private readonly logger = new Logger(UploadApplicationDocumentsHandler.name);

  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: IRepositoryApplication,
    private readonly supabaseService: SupabaseService,
  ) {}

  async execute(command: UploadApplicationDocumentsCommand): Promise<string[]> {
    const { applicationId, userId, files } = command;

    this.logger.log(
      `Uploading ${files.length} documents for application ${applicationId}`,
    );

    const application =
      await this.applicationRepository.findById(applicationId);
    if (!application) {
      throw new NotFoundException(
        `Application with ID ${applicationId} not found`,
      );
    }

    if (application.applicantId !== userId) {
      throw new ForbiddenException(
        'You can only upload documents to your own applications',
      );
    }

    if (
      application.isDraft() === false &&
      application.isSubmitted() === false
    ) {
      throw new BadRequestException(
        'Cannot upload documents to applications that are already processed',
      );
    }

    try {
      const filesData = files.map((file) => ({
        buffer: file.buffer,
        originalName: file.originalName,
      }));

      const uploadedUrls = await this.supabaseService.uploadMultipleFiles(
        filesData,
        applicationId,
      );

      this.logger.log(
        `Successfully uploaded ${uploadedUrls.length} files for application ${applicationId}`,
      );

      const existingDocuments = application.documents || [];
      const updatedDocuments = [...existingDocuments, ...uploadedUrls];

      await this.applicationRepository.update(applicationId, {
        documents: updatedDocuments,
      });

      this.logger.log(
        `Updated application ${applicationId} with ${uploadedUrls.length} new document URLs`,
      );

      return uploadedUrls;
    } catch (error) {
      this.logger.error(
        `Failed to upload documents for application ${applicationId}`,
        error,
      );
      throw new BadRequestException(
        'Failed to upload documents. Please try again.',
      );
    }
  }
}
