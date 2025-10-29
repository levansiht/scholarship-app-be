import { BaseCommand } from '../../../common/base.command';

export class RejectApplicationCommand extends BaseCommand {
  constructor(public readonly applicationId: string) {
    super();
  }
}
