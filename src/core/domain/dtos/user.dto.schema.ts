import { z } from 'zod';
import { EmailSchema, PasswordSchema } from '../schemas';

export const CreateUserDtoSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  role: z.enum(['STUDENT', 'ADMIN', 'SPONSOR'], {
    message: 'Role must be STUDENT, ADMIN, or SPONSOR',
  }),
});

export type CreateUserDtoType = z.infer<typeof CreateUserDtoSchema>;

export const UpdateUserDtoSchema = z.object({
  email: EmailSchema.optional(),
  password: PasswordSchema.optional(),
  status: z
    .enum(['ACTIVE', 'INACTIVE', 'SUSPENDED'], {
      message: 'Status must be ACTIVE, INACTIVE, or SUSPENDED',
    })
    .optional(),
});

export type UpdateUserDtoType = z.infer<typeof UpdateUserDtoSchema>;

export const UserFilterDtoSchema = z.object({
  role: z.enum(['STUDENT', 'ADMIN', 'SPONSOR']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  email: EmailSchema.optional(),
});

export type UserFilterDtoType = z.infer<typeof UserFilterDtoSchema>;

export const validateCreateUserDto = (data: unknown): CreateUserDtoType => {
  return CreateUserDtoSchema.parse(data);
};

export const validateUpdateUserDto = (data: unknown): UpdateUserDtoType => {
  return UpdateUserDtoSchema.parse(data);
};

export const validateUserFilterDto = (data: unknown): UserFilterDtoType => {
  return UserFilterDtoSchema.parse(data);
};
