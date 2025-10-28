import { z } from 'zod';

export const GPASchema = z
  .number()
  .min(0, 'GPA must be at least 0.00')
  .max(4, 'GPA must not exceed 4.00');

export type GPASchemaType = z.infer<typeof GPASchema>;

export const validateGPA = (value: number): number => {
  return GPASchema.parse(value);
};

export const isValidGPA = (value: number): boolean => {
  return GPASchema.safeParse(value).success;
};
