import { z } from 'zod';
import { GENERAL_VALIDATION_MESSAGES as MSG } from '../../../shared/constants';

export const GPASchema = z
  .number()
  .min(0, MSG.GPA.MIN_VALUE)
  .max(4, MSG.GPA.MAX_VALUE);

export type GPASchemaType = z.infer<typeof GPASchema>;

export const validateGPA = (value: number): number => {
  return GPASchema.parse(value);
};

export const isValidGPA = (value: number): boolean => {
  return GPASchema.safeParse(value).success;
};
