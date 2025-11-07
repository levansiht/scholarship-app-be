import { z } from 'zod';

// DTO Schema for setting eligibility criteria
export const SetEligibilityCriteriaDtoSchema = z
  .object({
    minGpa: z
      .number()
      .min(0, 'Minimum GPA must be at least 0.00')
      .max(4, 'Minimum GPA must not exceed 4.00')
      .multipleOf(0.01, 'GPA must have at most 2 decimal places')
      .optional(),
    maxGpa: z
      .number()
      .min(0, 'Maximum GPA must be at least 0.00')
      .max(4, 'Maximum GPA must not exceed 4.00')
      .multipleOf(0.01, 'GPA must have at most 2 decimal places')
      .optional(),
    allowedMajors: z
      .array(z.string())
      .default([])
      .describe('List of allowed majors (empty = all majors allowed)'),
    allowedYearOfStudy: z
      .array(z.number().int().min(1).max(6))
      .default([])
      .describe('List of allowed years of study (empty = all years allowed)'),
    minAge: z
      .number()
      .int()
      .min(15, 'Minimum age must be at least 15')
      .max(100, 'Minimum age must not exceed 100')
      .optional(),
    maxAge: z
      .number()
      .int()
      .min(15, 'Maximum age must be at least 15')
      .max(100, 'Maximum age must not exceed 100')
      .optional(),
    requiredNationality: z.string().optional(),
    otherRequirements: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.minGpa !== undefined && data.maxGpa !== undefined) {
        return data.minGpa <= data.maxGpa;
      }
      return true;
    },
    {
      message: 'Minimum GPA cannot be greater than maximum GPA',
      path: ['minGpa'],
    },
  )
  .refine(
    (data) => {
      if (data.minAge !== undefined && data.maxAge !== undefined) {
        return data.minAge <= data.maxAge;
      }
      return true;
    },
    {
      message: 'Minimum age cannot be greater than maximum age',
      path: ['minAge'],
    },
  );

export type SetEligibilityCriteriaDto = z.infer<
  typeof SetEligibilityCriteriaDtoSchema
>;

// DTO Schema for updating eligibility criteria
export const UpdateEligibilityCriteriaDtoSchema = z
  .object({
    minGpa: z
      .number()
      .min(0, 'Minimum GPA must be at least 0.00')
      .max(4, 'Minimum GPA must not exceed 4.00')
      .multipleOf(0.01, 'GPA must have at most 2 decimal places')
      .optional(),
    maxGpa: z
      .number()
      .min(0, 'Maximum GPA must be at least 0.00')
      .max(4, 'Maximum GPA must not exceed 4.00')
      .multipleOf(0.01, 'GPA must have at most 2 decimal places')
      .optional(),
    allowedMajors: z.array(z.string()).optional(),
    allowedYearOfStudy: z.array(z.number().int().min(1).max(6)).optional(),
    minAge: z
      .number()
      .int()
      .min(15, 'Minimum age must be at least 15')
      .max(100, 'Minimum age must not exceed 100')
      .optional(),
    maxAge: z
      .number()
      .int()
      .min(15, 'Maximum age must be at least 15')
      .max(100, 'Maximum age must not exceed 100')
      .optional(),
    requiredNationality: z.string().optional(),
    otherRequirements: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.minGpa !== undefined && data.maxGpa !== undefined) {
        return data.minGpa <= data.maxGpa;
      }
      return true;
    },
    {
      message: 'Minimum GPA cannot be greater than maximum GPA',
      path: ['minGpa'],
    },
  )
  .refine(
    (data) => {
      if (data.minAge !== undefined && data.maxAge !== undefined) {
        return data.minAge <= data.maxAge;
      }
      return true;
    },
    {
      message: 'Minimum age cannot be greater than maximum age',
      path: ['minAge'],
    },
  );

export type UpdateEligibilityCriteriaDto = z.infer<
  typeof UpdateEligibilityCriteriaDtoSchema
>;
