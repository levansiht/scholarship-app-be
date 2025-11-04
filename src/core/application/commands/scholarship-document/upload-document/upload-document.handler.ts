import { Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '../../../common';
import { UploadDocumentCommand } from './upload-document.command';
import {
  SCHOLARSHIP_DOCUMENT_REPOSITORY,
  IScholarshipDocumentRepository,
  SCHOLARSHIP_REPOSITORY,
  IRepositoryScholarship,
} from '../../../../domain/interfaces/repositories';
import { ScholarshipDocument } from '../../../../domain/entities/scholarship-document.entity';
import { SupabaseService } from '../../../../../infras/storage/supabase/supabase.service';

@CommandHandler(UploadDocumentCommand)
export class UploadDocumentCommandHandler extends BaseCommandHandler<
  UploadDocumentCommand,
  ScholarshipDocument
> {
  constructor(
    @Inject(SCHOLARSHIP_DOCUMENT_REPOSITORY)
    private readonly documentRepository: IScholarshipDocumentRepository,
    @Inject(SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: IRepositoryScholarship,
    private readonly supabaseService: SupabaseService,
  ) {
    super();
  }

  async execute(command: UploadDocumentCommand): Promise<ScholarshipDocument> {
    const { scholarshipId, title, description, file } = command.data;

    // Verify scholarship exists
    const scholarship =
      await this.scholarshipRepository.findById(scholarshipId);
    if (!scholarship) {
      throw new NotFoundException(
        `Scholarship with ID ${scholarshipId} not found`,
      );
    }

    // Validate file
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG are allowed',
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    // Upload to Supabase
    const fileUrl = await this.supabaseService.uploadFile(
      file.buffer,
      file.originalname,
      `scholarships/${scholarshipId}/documents`,
    );

    // Save document record to database
    const document = await this.documentRepository.create({
      scholarshipId,
      title,
      description,
      fileUrl,
      fileSize: file.size,
      mimeType: file.mimetype,
    });

    return document;
  }
}
