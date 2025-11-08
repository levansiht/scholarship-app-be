import { BaseCommand } from '../../../common';

export class VerifySponsorCommand extends BaseCommand {
  constructor(public readonly userId: string) {
    super();
  }
}
