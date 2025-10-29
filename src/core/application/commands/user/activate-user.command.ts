import { BaseCommand } from '../../common/base.command';
import type { ActivateUserCommandDto } from './dtos';

export class ActivateUserCommand extends BaseCommand {
  constructor(public readonly dto: ActivateUserCommandDto) {
    super();
  }
}
