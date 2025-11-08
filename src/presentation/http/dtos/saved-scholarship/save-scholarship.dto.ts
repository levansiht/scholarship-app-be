import { z } from 'zod';
import { UuidSchema } from '../../../../shared/constants/validation';

export const SaveScholarshipDtoSchema = z.object({
  scholarshipId: UuidSchema,
  note: z.string().max(500).optional(),
});

export type SaveScholarshipDto = z.infer<typeof SaveScholarshipDtoSchema>;
