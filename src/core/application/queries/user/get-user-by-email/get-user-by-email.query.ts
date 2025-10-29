import { BaseQuery } from '../../../common/base.query';

export class GetUserByEmailQuery extends BaseQuery {
  constructor(public readonly email: string) {
    super();
  }
}
