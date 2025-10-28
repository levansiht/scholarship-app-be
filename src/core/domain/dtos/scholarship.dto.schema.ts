import { z } from 'zod';

export const CreateScholarshipDtoSchema = z.object({
  createdBy: z.string().uuid('createdBy must be a valid UUID'),
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title must not exceed 200 characters'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(250, 'Slug must not exceed 250 characters')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase with hyphens only',
    ),
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.enum(['VND', 'USD'], {
    message: 'Currency must be VND or USD',
  }),
  numberOfSlots: z
    .number()
    .int('Number of slots must be an integer')
    .positive('Number of slots must be positive'),
  deadline: z.coerce
    .date({ message: 'Deadline must be a valid date' })
    .refine((date) => date > new Date(), {
      message: 'Deadline must be in the future',
    }),
  startDate: z.coerce.date({ message: 'Start date must be a valid date' }),
  endDate: z.coerce
    .date({ message: 'End date must be a valid date' })
    .optional()
    .nullable(),
  tags: z.array(z.string()).default([]),
  thumbnailUrl: z
    .string()
    .url('Thumbnail URL must be valid')
    .optional()
    .nullable(),
});

export type CreateScholarshipDtoType = z.infer<
  typeof CreateScholarshipDtoSchema
>;

export const UpdateScholarshipDtoSchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title must not exceed 200 characters')
    .optional(),
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description must not exceed 5000 characters')
    .optional(),
  deadline: z.coerce
    .date({ message: 'Deadline must be a valid date' })
    .optional(),
  numberOfSlots: z
    .number()
    .int('Number of slots must be an integer')
    .positive('Number of slots must be positive')
    .optional(),
  status: z
    .enum(['DRAFT', 'OPEN', 'CLOSED', 'SUSPENDED', 'EXPIRED'], {
      message: 'Status must be DRAFT, OPEN, CLOSED, SUSPENDED, or EXPIRED',
    })
    .optional(),
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
