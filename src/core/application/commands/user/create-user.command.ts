import { BaseCommand } from '../../common/base.command';
import type { CreateUserCommandDto } from './dtos';

export class CreateUserCommand extends BaseCommand {
  constructor(public readonly dto: CreateUserCommandDto) {
    super();
  }
}
