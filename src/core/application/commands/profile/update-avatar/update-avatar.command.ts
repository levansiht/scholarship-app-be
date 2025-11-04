import { BaseCommand } from '../../../common';

export class UpdateAvatarCommand extends BaseCommand {
  constructor(
    public readonly userId: string,
    public readonly avatarUrl: string,
  ) {
    super();
  }
}
