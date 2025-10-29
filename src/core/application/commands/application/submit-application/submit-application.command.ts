import { BaseCommand } from '../../../common/base.command';
import type { CreateApplicationDto } from '../../../../domain/dtos';

export class SubmitApplicationCommand extends BaseCommand {
  constructor(public readonly data: CreateApplicationDto) {
    super();
  }
}
