import { z } from 'zod';

export const EmailSchema = z
  .string()
  .email('Invalid email format')
  .toLowerCase()
  .trim();

export type EmailSchemaType = z.infer<typeof EmailSchema>;

export const validateEmail = (value: string): string => {
  return EmailSchema.parse(value);
};

export const isValidEmail = (value: string): boolean => {
  return EmailSchema.safeParse(value).success;
};
