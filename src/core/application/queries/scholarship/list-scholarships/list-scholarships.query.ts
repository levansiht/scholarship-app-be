import { BaseQuery } from '../../../common/base.query';
import type { ScholarshipStatus } from '../../../../../shared/constants';

export interface ListScholarshipsQueryParams {
  page?: number;
  limit?: number;
  status?: ScholarshipStatus;
  createdBy?: string;
}

export class ListScholarshipsQuery extends BaseQuery {
  public readonly page: number;
  public readonly limit: number;
  public readonly status?: ScholarshipStatus;
  public readonly createdBy?: string;

  constructor(params: ListScholarshipsQueryParams = {}) {
    super();
    this.page = params.page ?? 1;
    this.limit = params.limit ?? 10;
    this.status = params.status;
    this.createdBy = params.createdBy;
  }
}
