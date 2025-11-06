import { BaseQuery } from '../../../common';

export class GetRequirementsQuery extends BaseQuery {
  constructor(public readonly scholarshipId: string) {
    super();
  }
}
