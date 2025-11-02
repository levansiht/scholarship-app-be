import { UploadedFile } from '../../../../domain/value-objects';

export class UploadApplicationDocumentsCommand {
  constructor(
    public readonly applicationId: string,
    public readonly userId: string,
    public readonly files: UploadedFile[],
  ) {}
}
