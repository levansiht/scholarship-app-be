import { BaseCommand } from '../../../common/base.command';
import type { UserRole } from '../../../../../shared/constants';

export class ApproveApplicationCommand extends BaseCommand {
  constructor(
    public readonly applicationId: string,
    public readonly userId?: string,
    public readonly userRole?: UserRole,
  ) {
    super();
  }
}
