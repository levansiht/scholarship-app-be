import { z } from 'zod';
import { UuidSchema, ApplicationStatusEnum } from './dto.constants';

export const CreateApplicationDtoSchema = z.object({
  scholarshipId: UuidSchema,
  applicantId: UuidSchema,
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
  status: ApplicationStatusEnum.optional(),
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
