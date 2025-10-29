import { z } from 'zod';
import { EmailSchema, PasswordSchema } from '../../../../domain/schemas';
import { UserIdSchema, UserStatusEnum } from './user-command.constants';

/**
 * Update User Command DTO
 * Used for updating existing user information
 */
export const UpdateUserCommandDtoSchema = z.object({
  userId: UserIdSchema,
  email: EmailSchema.optional(),
  password: PasswordSchema.optional(),
  status: UserStatusEnum.optional(),
});

export type UpdateUserCommandDto = z.infer<typeof UpdateUserCommandDtoSchema>;

/**
 * Validate Update User Command DTO
 */
export const validateUpdateUserCommandDto = (
  data: unknown,
): UpdateUserCommandDto => {
  return UpdateUserCommandDtoSchema.parse(data);
};
