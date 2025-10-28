import type { IQuery } from './query.interface';
export interface IQueryHandler<TQuery extends IQuery, TResult> {
  query(query: TQuery): Promise<TResult>;
}
