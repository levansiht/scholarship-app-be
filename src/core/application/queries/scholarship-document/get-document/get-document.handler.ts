import { Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { BaseQueryHandler } from '../../../common';
import { GetDocumentQuery } from './get-document.query';
import {
  SCHOLARSHIP_DOCUMENT_REPOSITORY,
  IScholarshipDocumentRepository,
} from '../../../../domain/interfaces/repositories';
import { ScholarshipDocument } from '../../../../domain/entities/scholarship-document.entity';

@QueryHandler(GetDocumentQuery)
export class GetDocumentQueryHandler extends BaseQueryHandler<
  GetDocumentQuery,
  ScholarshipDocument
> {
  constructor(
    @Inject(SCHOLARSHIP_DOCUMENT_REPOSITORY)
    private readonly documentRepository: IScholarshipDocumentRepository,
  ) {
    super();
  }

  async query(query: GetDocumentQuery): Promise<ScholarshipDocument> {
    const { documentId, scholarshipId } = query;

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

    return document;
  }
}
