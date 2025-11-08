import { BaseQuery } from '../../../common';

export class GetOwnSponsorProfileQuery extends BaseQuery {
  constructor(public readonly userId: string) {
    super();
  }
}
