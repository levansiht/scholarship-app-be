import { BaseQuery } from '../../../common';

export class GetDocumentsQuery extends BaseQuery {
  constructor(public readonly scholarshipId: string) {
    super();
  }
}
