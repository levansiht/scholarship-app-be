import { BaseQuery } from '../../../common/base.query';

export class GetScholarshipByIdQuery extends BaseQuery {
  constructor(public readonly scholarshipId: string) {
    super();
  }
}
