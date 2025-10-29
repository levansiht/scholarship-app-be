import { BaseCommand } from '../../common/base.command';
import type { ChangePasswordCommandDto } from './dtos';

export class ChangePasswordCommand extends BaseCommand {
  constructor(public readonly dto: ChangePasswordCommandDto) {
    super();
  }
}
