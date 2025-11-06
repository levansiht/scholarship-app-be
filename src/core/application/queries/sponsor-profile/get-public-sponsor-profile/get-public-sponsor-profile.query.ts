import { BaseQuery } from '../../../common';

export class GetPublicSponsorProfileQuery extends BaseQuery {
  constructor(public readonly userId: string) {
    super();
  }
}
