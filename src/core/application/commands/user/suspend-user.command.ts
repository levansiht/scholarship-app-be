import { BaseCommand } from '../../common/base.command';
import type { SuspendUserCommandDto } from './dtos';

export class SuspendUserCommand extends BaseCommand {
  constructor(public readonly dto: SuspendUserCommandDto) {
    super();
  }
}
