import { BaseQuery } from '../../../common';

export class GetDocumentQuery extends BaseQuery {
  constructor(
    public readonly documentId: string,
    public readonly scholarshipId: string,
  ) {
    super();
  }
}
