import { z } from 'zod';
import { PasswordSchema } from '../../../../domain/schemas';
import { UserIdSchema } from './user-command.constants';

export const ChangePasswordCommandDtoSchema = z.object({
  userId: UserIdSchema,
  oldPassword: PasswordSchema,
  newPassword: PasswordSchema,
});

export type ChangePasswordCommandDto = z.infer<
  typeof ChangePasswordCommandDtoSchema
>;

export const validateChangePasswordCommandDto = (
  data: unknown,
): ChangePasswordCommandDto => {
  return ChangePasswordCommandDtoSchema.parse(data);
};
