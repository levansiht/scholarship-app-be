import { BaseCommand } from '../../../common/base.command';

export class PublishScholarshipCommand extends BaseCommand {
  constructor(public readonly scholarshipId: string) {
    super();
  }
}
