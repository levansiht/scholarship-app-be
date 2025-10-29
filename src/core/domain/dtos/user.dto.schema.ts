import { z } from 'zod';
import { EmailSchema, PasswordSchema } from '../schemas';
import { UserRoleEnum, UserStatusEnum } from './dto.constants';

export const CreateUserDtoSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  role: UserRoleEnum,
});

export type CreateUserDtoType = z.infer<typeof CreateUserDtoSchema>;

export const UpdateUserDtoSchema = z.object({
  email: EmailSchema.optional(),
  password: PasswordSchema.optional(),
  status: UserStatusEnum.optional(),
});

export type UpdateUserDtoType = z.infer<typeof UpdateUserDtoSchema>;

export const UserFilterDtoSchema = z.object({
  role: UserRoleEnum.optional(),
  status: UserStatusEnum.optional(),
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
