import { BaseQuery } from '../../../common';

export class GetPublicStudentProfileQuery extends BaseQuery {
  constructor(public readonly userId: string) {
    super();
  }
}
