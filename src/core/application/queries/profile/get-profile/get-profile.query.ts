import { BaseQuery } from '../../../common';

export class GetProfileQuery extends BaseQuery {
  constructor(public readonly userId: string) {
    super();
  }
}
