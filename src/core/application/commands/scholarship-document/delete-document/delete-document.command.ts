import { BaseCommand } from '../../../common';

export class DeleteDocumentCommand extends BaseCommand {
  constructor(
    public readonly documentId: string,
    public readonly scholarshipId: string,
  ) {
    super();
  }
}
