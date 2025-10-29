import { z } from 'zod';
import {
  UuidSchema,
  ApplicationStatusEnum,
  APPLICATION_VALIDATION_MESSAGES as MSG,
} from '../../../shared/constants';

export const CreateApplicationDtoSchema = z.object({
  scholarshipId: UuidSchema,
  applicantId: UuidSchema,
  coverLetter: z
    .string()
    .min(100, MSG.COVER_LETTER.MIN_LENGTH)
    .max(2000, MSG.COVER_LETTER.MAX_LENGTH)
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
    .min(100, MSG.COVER_LETTER.MIN_LENGTH)
    .max(2000, MSG.COVER_LETTER.MAX_LENGTH)
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
