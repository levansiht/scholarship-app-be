import type { IQuery } from './interfaces/query.interface';

export abstract class BaseQuery implements IQuery {
  public readonly timestamp: Date;

  constructor() {
    this.timestamp = new Date();
    // Remove Object.freeze - it prevents child classes from adding properties
  }
}
