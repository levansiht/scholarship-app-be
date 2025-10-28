import { z } from 'zod';
import { Result } from '../types/result.type';
import { ValidationResult } from '../types/validation.type';

export function validateWithZod<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
): Result<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    const validationResult = ValidationResult.fromZodError(result.error);
    return Result.fail('Validation failed', validationResult.errors);
  }

  return Result.ok(result.data);
}

export function parseWithZod<T>(data: unknown, schema: z.ZodSchema<T>): T {
  return schema.parse(data);
}

export function safeParseWithZod<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
):
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> } {
  const result = schema.safeParse(data);

  if (!result.success) {
    const validationResult = ValidationResult.fromZodError(result.error);
    return { success: false, errors: validationResult.errors };
  }

  return { success: true, data: result.data };
}
