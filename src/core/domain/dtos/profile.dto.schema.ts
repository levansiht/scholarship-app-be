import { z } from 'zod';

export const UpdateProfileDtoSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phoneNumber: z.string().min(10).max(15).optional(),
  dateOfBirth: z.coerce.date().optional(),
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
});

export type UpdateProfileDtoType = z.infer<typeof UpdateProfileDtoSchema>;

export const validateUpdateProfileDto = (
  data: unknown,
): UpdateProfileDtoType => {
  return UpdateProfileDtoSchema.parse(data);
};
