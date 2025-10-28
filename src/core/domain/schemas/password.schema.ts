import { z } from 'zod';

export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must not exceed 100 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(
    /[^A-Za-z0-9]/,
    'Password must contain at least one special character',
  );

export type PasswordSchemaType = z.infer<typeof PasswordSchema>;

export const validatePassword = (value: string): string => {
  return PasswordSchema.parse(value);
};

export const isValidPassword = (value: string): boolean => {
  return PasswordSchema.safeParse(value).success;
};
