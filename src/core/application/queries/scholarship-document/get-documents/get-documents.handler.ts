import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { BaseQueryHandler } from '../../../common';
import { GetDocumentsQuery } from './get-documents.query';
import {
  SCHOLARSHIP_DOCUMENT_REPOSITORY,
  IScholarshipDocumentRepository,
} from '../../../../domain/interfaces/repositories';
import { ScholarshipDocument } from '../../../../domain/entities/scholarship-document.entity';

@QueryHandler(GetDocumentsQuery)
export class GetDocumentsQueryHandler extends BaseQueryHandler<
  GetDocumentsQuery,
  ScholarshipDocument[]
> {
  constructor(
    @Inject(SCHOLARSHIP_DOCUMENT_REPOSITORY)
    private readonly documentRepository: IScholarshipDocumentRepository,
  ) {
    super();
  }

  async query(query: GetDocumentsQuery): Promise<ScholarshipDocument[]> {
    const { scholarshipId } = query;

    const documents =
      await this.documentRepository.findByScholarshipId(scholarshipId);

    return documents;
  }
}
