import { z } from 'zod';
import {
  UuidSchema,
  CurrencyEnum as ScholarshipCurrencyEnum,
  ScholarshipStatusEnum,
  SCHOLARSHIP_VALIDATION_MESSAGES as MSG,
} from '../../../shared/constants';

export const CreateScholarshipDtoSchema = z.object({
  createdBy: UuidSchema,
  title: z
    .string()
    .min(10, MSG.TITLE.MIN_LENGTH)
    .max(200, MSG.TITLE.MAX_LENGTH),
  slug: z
    .string()
    .min(3, MSG.SLUG.MIN_LENGTH)
    .max(250, MSG.SLUG.MAX_LENGTH)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, MSG.SLUG.INVALID_FORMAT),
  description: z
    .string()
    .min(50, MSG.DESCRIPTION.MIN_LENGTH)
    .max(5000, MSG.DESCRIPTION.MAX_LENGTH),
  amount: z.number().positive(MSG.AMOUNT.POSITIVE),
  currency: ScholarshipCurrencyEnum,
  numberOfSlots: z
    .number()
    .int(MSG.NUMBER_OF_SLOTS.INTEGER)
    .positive(MSG.NUMBER_OF_SLOTS.POSITIVE),
  deadline: z.coerce
    .date({ message: MSG.DEADLINE.INVALID })
    .refine((date) => date > new Date(), {
      message: MSG.DEADLINE.FUTURE,
    }),
  startDate: z.coerce.date({ message: MSG.START_DATE.INVALID }),
  endDate: z.coerce
    .date({ message: MSG.END_DATE.INVALID })
    .optional()
    .nullable(),
  tags: z.array(z.string()).default([]),
  thumbnailUrl: z.string().url(MSG.THUMBNAIL_URL.INVALID).optional().nullable(),
});

export type CreateScholarshipDtoType = z.infer<
  typeof CreateScholarshipDtoSchema
>;

export const UpdateScholarshipDtoSchema = z.object({
  title: z
    .string()
    .min(10, MSG.TITLE.MIN_LENGTH)
    .max(200, MSG.TITLE.MAX_LENGTH)
    .optional(),
  description: z
    .string()
    .min(50, MSG.DESCRIPTION.MIN_LENGTH)
    .max(5000, MSG.DESCRIPTION.MAX_LENGTH)
    .optional(),
  deadline: z.coerce.date({ message: MSG.DEADLINE.INVALID }).optional(),
  numberOfSlots: z
    .number()
    .int(MSG.NUMBER_OF_SLOTS.INTEGER)
    .positive(MSG.NUMBER_OF_SLOTS.POSITIVE)
    .optional(),
  status: ScholarshipStatusEnum.optional(),
});

export type UpdateScholarshipDtoType = z.infer<
  typeof UpdateScholarshipDtoSchema
>;

export const validateCreateScholarshipDto = (
  data: unknown,
): CreateScholarshipDtoType => {
  return CreateScholarshipDtoSchema.parse(data);
};

export const validateUpdateScholarshipDto = (
  data: unknown,
): UpdateScholarshipDtoType => {
  return UpdateScholarshipDtoSchema.parse(data);
};
