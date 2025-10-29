import { BaseCommand } from '../../../common/base.command';

export class CloseScholarshipCommand extends BaseCommand {
  constructor(public readonly scholarshipId: string) {
    super();
  }
}
