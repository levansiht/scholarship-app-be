import type { IQuery } from './interfaces/query.interface';

export abstract class BaseQuery implements IQuery {
  public readonly timestamp: Date;

  constructor() {
    this.timestamp = new Date();
    Object.freeze(this);
  }
}
