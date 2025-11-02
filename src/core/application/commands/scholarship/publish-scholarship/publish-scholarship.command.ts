import { BaseCommand } from '../../../common/base.command';
import type { UserRole } from '../../../../../shared/constants';

export class PublishScholarshipCommand extends BaseCommand {
  constructor(
    public readonly scholarshipId: string,
    public readonly userId?: string,
    public readonly userRole?: UserRole,
  ) {
    super();
  }
}
