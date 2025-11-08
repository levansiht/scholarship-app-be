import { BaseCommand } from '../../../common';

export interface UploadDocumentData {
  scholarshipId: string;
  title: string;
  description?: string;
  file: Express.Multer.File;
}

export class UploadDocumentCommand extends BaseCommand {
  constructor(public readonly data: UploadDocumentData) {
    super();
  }
}
