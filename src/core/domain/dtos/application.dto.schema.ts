import { z } from 'zod';

export const CreateApplicationDtoSchema = z.object({
  scholarshipId: z.string().uuid('scholarshipId must be a valid UUID'),
  applicantId: z.string().uuid('applicantId must be a valid UUID'),
  coverLetter: z
    .string()
    .min(100, 'Cover letter must be at least 100 characters')
    .max(2000, 'Cover letter must not exceed 2000 characters')
    .optional()
    .nullable(),
  additionalInfo: z.record(z.string(), z.unknown()).optional().nullable(),
});

export type CreateApplicationDtoType = z.infer<
  typeof CreateApplicationDtoSchema
>;

export const UpdateApplicationDtoSchema = z.object({
  coverLetter: z
    .string()
    .min(100, 'Cover letter must be at least 100 characters')
    .max(2000, 'Cover letter must not exceed 2000 characters')
    .optional()
    .nullable(),
  additionalInfo: z.record(z.string(), z.unknown()).optional().nullable(),
  status: z
    .enum([
      'DRAFT',
      'SUBMITTED',
      'UNDER_REVIEW',
      'APPROVED',
      'REJECTED',
      'AWARDED',
      'WITHDRAWN',
      'CANCELLED',
    ])
    .optional(),
});

export type UpdateApplicationDtoType = z.infer<
  typeof UpdateApplicationDtoSchema
>;

export const validateCreateApplicationDto = (
  data: unknown,
): CreateApplicationDtoType => {
  return CreateApplicationDtoSchema.parse(data);
};

export const validateUpdateApplicationDto = (
  data: unknown,
): UpdateApplicationDtoType => {
  return UpdateApplicationDtoSchema.parse(data);
};
