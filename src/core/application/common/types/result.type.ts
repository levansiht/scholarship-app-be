export class Result<T> {
  public readonly success: boolean;
  public readonly data?: T;
  public readonly error?: string;
  public readonly errors?: Record<string, string[]>;
  public readonly timestamp: Date;
  private constructor(
    success: boolean,
    data?: T,
    error?: string,
    errors?: Record<string, string[]>,
  ) {
    this.success = success;
    this.data = data;
    this.error = error;
    this.errors = errors;
    this.timestamp = new Date();

    Object.freeze(this);
  }
  public static ok<T>(data: T): Result<T> {
    return new Result<T>(true, data);
  }

  public static fail<T>(
    error: string,
    errors?: Record<string, string[]>,
  ): Result<T> {
    return new Result<T>(false, undefined, error, errors);
  }

  public isSuccess(): boolean {
    return this.success;
  }

  public isFailure(): boolean {
    return !this.success;
  }

  public getValue(): T {
    if (!this.success) {
      throw new Error(this.error || 'Cannot get value from failed result');
    }

    if (this.data === undefined) {
      throw new Error('Success result has no data');
    }

    return this.data;
  }

  public getValueOr(defaultValue: T): T {
    return this.success && this.data !== undefined ? this.data : defaultValue;
  }

  public getFirstError(): string | undefined {
    if (this.error) {
      return this.error;
    }

    if (this.errors) {
      const firstField = Object.keys(this.errors)[0];
      if (firstField && this.errors[firstField].length > 0) {
        return this.errors[firstField][0];
      }
    }

    return undefined;
  }

  public map<U>(fn: (value: T) => U): Result<U> {
    if (this.isFailure()) {
      return Result.fail<U>(this.error ?? 'Unknown error', this.errors);
    }

    try {
      return Result.ok(fn(this.getValue()));
    } catch (error) {
      return Result.fail<U>(
        error instanceof Error ? error.message : 'Mapping failed',
      );
    }
  }

  public toJSON(): Record<string, unknown> {
    return {
      success: this.success,
      data: this.data,
      error: this.error,
      errors: this.errors,
      timestamp: this.timestamp.toISOString(),
    };
  }
}
