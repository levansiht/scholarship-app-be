import { z } from 'zod';

export class ValidationResult {
  public readonly isValid: boolean;
  public readonly errors: Record<string, string[]>;

  private constructor(isValid: boolean, errors: Record<string, string[]> = {}) {
    this.isValid = isValid;
    this.errors = errors;
    Object.freeze(this);
  }

  public static success(): ValidationResult {
    return new ValidationResult(true);
  }

  public static failure(errors: Record<string, string[]>): ValidationResult {
    return new ValidationResult(false, errors);
  }

  public static singleError(field: string, message: string): ValidationResult {
    return new ValidationResult(false, { [field]: [message] });
  }

  public static fromZodError(error: z.ZodError): ValidationResult {
    const fieldErrors: Record<string, string[]> = {};

    error.issues.forEach((issue) => {
      const field = issue.path.join('.');
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(issue.message);
    });

    return ValidationResult.failure(fieldErrors);
  }

  public getAllErrors(): string[] {
    return Object.values(this.errors).flat();
  }

  public getFieldErrors(field: string): string[] {
    return this.errors[field] || [];
  }

  public hasFieldError(field: string): boolean {
    return field in this.errors && this.errors[field].length > 0;
  }

  public static combine(...results: ValidationResult[]): ValidationResult {
    const allErrors: Record<string, string[]> = {};
    let isValid = true;

    for (const result of results) {
      if (!result.isValid) {
        isValid = false;
        Object.entries(result.errors).forEach(([field, messages]) => {
          if (!allErrors[field]) {
            allErrors[field] = [];
          }
          allErrors[field].push(...messages);
        });
      }
    }

    return isValid
      ? ValidationResult.success()
      : ValidationResult.failure(allErrors);
  }
}
