import { BaseCommand } from '../../common/base.command';
import type { UpdateUserCommandDto } from './dtos';

export class UpdateUserCommand extends BaseCommand {
  constructor(public readonly dto: UpdateUserCommandDto) {
    super();
  }
}
