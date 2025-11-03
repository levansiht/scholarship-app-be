import { BaseCommand } from '../../../common';

export class SaveScholarshipCommand extends BaseCommand {
  constructor(
    public readonly userId: string,
    public readonly scholarshipId: string,
    public readonly note?: string,
  ) {
    super();
  }
}
