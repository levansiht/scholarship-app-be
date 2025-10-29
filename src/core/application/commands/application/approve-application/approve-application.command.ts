import { BaseCommand } from '../../../common/base.command';

export class ApproveApplicationCommand extends BaseCommand {
  constructor(public readonly applicationId: string) {
    super();
  }
}
