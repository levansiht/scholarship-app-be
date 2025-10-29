import { BaseCommand } from '../../../common/base.command';

export class WithdrawApplicationCommand extends BaseCommand {
  constructor(public readonly applicationId: string) {
    super();
  }
}
