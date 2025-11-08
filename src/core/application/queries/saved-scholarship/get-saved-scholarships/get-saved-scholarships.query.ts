import { BaseQuery } from '../../../common';

export class GetSavedScholarshipsQuery extends BaseQuery {
  constructor(public readonly userId: string) {
    super();
  }
}
