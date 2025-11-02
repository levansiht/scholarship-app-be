import type { IQuery } from './interfaces/query.interface';
import type { IQueryHandler } from './interfaces/query-handler.interface';
import { ValidationResult } from './types/validation.type';
import { z } from 'zod';

export abstract class BaseQueryHandler<TQuery extends IQuery, TResult>
  implements IQueryHandler<TQuery, TResult>
{
  abstract query(query: TQuery): Promise<TResult>;

  // NestJS CQRS requires execute() method
  async execute(query: TQuery): Promise<TResult> {
    return this.query(query);
  }

  protected validate(queryObj: TQuery): void {
    if (!queryObj) {
      throw new Error('Query cannot be null or undefined');
    }

    if (!(queryObj instanceof Object)) {
      throw new Error('Query must be an object');
    }

    const validationResult = this.validateImpl(queryObj);
    if (!validationResult.isValid) {
      const errors = validationResult.getAllErrors().join(', ');
      throw new Error(`Validation failed: ${errors}`);
    }
  }

  protected validateImpl(_queryObj: TQuery): ValidationResult {
    void _queryObj;
    return ValidationResult.success();
  }

  protected validateWithSchema<T>(
    data: T,
    schema: z.ZodSchema<T>,
  ): ValidationResult {
    const result = schema.safeParse(data);

    if (!result.success) {
      return ValidationResult.fromZodError(result.error);
    }

    return ValidationResult.success();
  }
  protected log(message: string, data?: unknown): void {
    const handlerName = this.constructor.name;
    console.log(`[${handlerName}] ${message}`, data ? data : '');
  }

  protected logError(error: Error, queryObj: TQuery): void {
    const handlerName = this.constructor.name;
    console.error(`[${handlerName}] Error:`, {
      message: error.message,
      stack: error.stack,
      query: queryObj,
    });
  }

  protected async executeWithCache<T>(
    cacheKey: string,
    operation: () => Promise<T>,
  ): Promise<T> {
    this.log(`Cache key: ${cacheKey} (caching not implemented)`);
    return operation();
  }
}
