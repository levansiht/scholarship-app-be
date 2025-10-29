import { BaseQuery } from '../../../common/base.query';

export class SearchScholarshipsQuery extends BaseQuery {
  constructor(public readonly keyword: string) {
    super();
  }
}
