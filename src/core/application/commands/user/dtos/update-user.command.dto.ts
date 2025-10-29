import { z } from 'zod';
import { EmailSchema, PasswordSchema } from '../../../../domain/schemas';
import {
  UuidSchema as UserIdSchema,
  UserStatusEnum,
} from '../../../../../shared/constants';

export const UpdateUserCommandDtoSchema = z.object({
  userId: UserIdSchema,
  email: EmailSchema.optional(),
  password: PasswordSchema.optional(),
  status: UserStatusEnum.optional(),
});

export type UpdateUserCommandDto = z.infer<typeof UpdateUserCommandDtoSchema>;

export const validateUpdateUserCommandDto = (
  data: unknown,
): UpdateUserCommandDto => {
  return UpdateUserCommandDtoSchema.parse(data);
};
