import { BaseCommand } from '../../../common/base.command';
import type { CreateScholarshipDto } from '../../../../domain/dtos';

export class CreateScholarshipCommand extends BaseCommand {
  constructor(public readonly dto: CreateScholarshipDto) {
    super();
  }
}
