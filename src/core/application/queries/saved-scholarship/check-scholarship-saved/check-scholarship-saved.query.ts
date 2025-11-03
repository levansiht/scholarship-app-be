import { BaseQuery } from '../../../common';

export class CheckScholarshipSavedQuery extends BaseQuery {
  constructor(
    public readonly userId: string,
    public readonly scholarshipId: string,
  ) {
    super();
  }
}
