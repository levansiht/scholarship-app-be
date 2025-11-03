import { BaseCommand } from '../../../common';

export class UnsaveScholarshipCommand extends BaseCommand {
  constructor(
    public readonly userId: string,
    public readonly scholarshipId: string,
  ) {
    super();
  }
}
