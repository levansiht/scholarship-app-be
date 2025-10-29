import { BaseQuery } from '../../../common/base.query';
import type { UserRole, UserStatus } from '../../../../../shared/constants';

export interface ListUsersQueryParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}

export class ListUsersQuery extends BaseQuery {
  public readonly page: number;
  public readonly limit: number;
  public readonly role?: UserRole;
  public readonly status?: UserStatus;
  public readonly search?: string;

  constructor(params: ListUsersQueryParams = {}) {
    super();
    this.page = params.page ?? 1;
    this.limit = params.limit ?? 10;
    this.role = params.role;
    this.status = params.status;
    this.search = params.search;
  }
}
