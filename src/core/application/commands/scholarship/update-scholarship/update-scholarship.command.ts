import { BaseCommand } from '../../../common/base.command';
import type { UpdateScholarshipDto } from '../../../../domain/dtos';
import type { UserRole } from '../../../../../shared/constants';

export class UpdateScholarshipCommand extends BaseCommand {
  constructor(
    public readonly scholarshipId: string,
    public readonly dto: UpdateScholarshipDto,
    public readonly userId?: string,
    public readonly userRole?: UserRole,
  ) {
    super();
  }
}
