import { z } from 'zod';
import { EmailSchema, PasswordSchema } from '../../../../domain/schemas';
import { UserRoleEnum } from './user-command.constants';

/**
 * Create User Command DTO
 * Used for creating a new user in the system
 */
export const CreateUserCommandDtoSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  role: UserRoleEnum,
});

export type CreateUserCommandDto = z.infer<typeof CreateUserCommandDtoSchema>;

/**
 * Validate Create User Command DTO
 */
export const validateCreateUserCommandDto = (
  data: unknown,
): CreateUserCommandDto => {
  return CreateUserCommandDtoSchema.parse(data);
};
