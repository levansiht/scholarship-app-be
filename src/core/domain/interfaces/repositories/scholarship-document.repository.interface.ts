import { ScholarshipDocument } from '../../entities/scholarship-document.entity';

export interface CreateScholarshipDocumentData {
  scholarshipId: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

export interface IScholarshipDocumentRepository {
  create(data: CreateScholarshipDocumentData): Promise<ScholarshipDocument>;
  findById(id: string): Promise<ScholarshipDocument | null>;
  findByScholarshipId(scholarshipId: string): Promise<ScholarshipDocument[]>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}

export const SCHOLARSHIP_DOCUMENT_REPOSITORY =
  'SCHOLARSHIP_DOCUMENT_REPOSITORY';
