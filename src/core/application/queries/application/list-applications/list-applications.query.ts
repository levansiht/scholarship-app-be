import { BaseQuery } from '../../../common/base.query';
import type { ApplicationStatus } from '../../../../../shared/constants';

export class ListApplicationsQuery extends BaseQuery {
  constructor(
    public readonly page?: number,
    public readonly limit?: number,
    public readonly status?: ApplicationStatus,
    public readonly scholarshipId?: string,
  ) {
    super();
  }
}
