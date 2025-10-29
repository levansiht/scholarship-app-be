import { z } from 'zod';
import { USER_VALIDATION_MESSAGES as MSG } from '../../../shared/constants';

export const PasswordSchema = z
  .string()
  .min(8, MSG.PASSWORD.MIN_LENGTH)
  .max(100, MSG.PASSWORD.MAX_LENGTH)
  .regex(/[A-Z]/, MSG.PASSWORD.UPPERCASE)
  .regex(/[a-z]/, MSG.PASSWORD.LOWERCASE)
  .regex(/[0-9]/, MSG.PASSWORD.NUMBER)
  .regex(/[^A-Za-z0-9]/, MSG.PASSWORD.SPECIAL_CHAR);

export type PasswordSchemaType = z.infer<typeof PasswordSchema>;

export const validatePassword = (value: string): string => {
  return PasswordSchema.parse(value);
};

export const isValidPassword = (value: string): boolean => {
  return PasswordSchema.safeParse(value).success;
};
