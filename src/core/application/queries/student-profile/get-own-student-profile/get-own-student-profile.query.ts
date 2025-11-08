import { BaseQuery } from '../../../common';

export class GetOwnStudentProfileQuery extends BaseQuery {
  constructor(public readonly userId: string) {
    super();
  }
}
