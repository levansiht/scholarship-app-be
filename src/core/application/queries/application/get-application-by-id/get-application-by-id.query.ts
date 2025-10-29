import { BaseQuery } from '../../../common/base.query';

export class GetApplicationByIdQuery extends BaseQuery {
  constructor(public readonly applicationId: string) {
    super();
  }
}
