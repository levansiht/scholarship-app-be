import { BaseCommand } from '../../../common/base.command';
import type { UpdateScholarshipDto } from '../../../../domain/dtos';

export class UpdateScholarshipCommand extends BaseCommand {
  constructor(
    public readonly scholarshipId: string,
    public readonly dto: UpdateScholarshipDto,
  ) {
    super();
  }
}
