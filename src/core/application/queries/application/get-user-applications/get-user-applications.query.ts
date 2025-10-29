import { BaseQuery } from '../../../common/base.query';

export class GetUserApplicationsQuery extends BaseQuery {
  constructor(public readonly userId: string) {
    super();
  }
}
