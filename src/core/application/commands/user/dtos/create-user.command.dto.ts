import { z } from 'zod';
import { EmailSchema, PasswordSchema } from '../../../../domain/schemas';
import { UserRoleEnum } from '../../../../../shared/constants';

export const CreateUserCommandDtoSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  role: UserRoleEnum,
});

export type CreateUserCommandDto = z.infer<typeof CreateUserCommandDtoSchema>;

export const validateCreateUserCommandDto = (
  data: unknown,
): CreateUserCommandDto => {
  return CreateUserCommandDtoSchema.parse(data);
};
