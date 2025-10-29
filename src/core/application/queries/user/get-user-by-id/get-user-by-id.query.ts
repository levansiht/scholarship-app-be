import { BaseQuery } from '../../../common/base.query';

export class GetUserByIdQuery extends BaseQuery {
  constructor(public readonly userId: string) {
    super();
  }
}
