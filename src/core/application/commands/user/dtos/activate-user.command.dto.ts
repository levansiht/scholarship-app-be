import { z } from 'zod';
import { UserIdSchema } from './user-command.constants';

export const ActivateUserCommandDtoSchema = z.object({
  userId: UserIdSchema,
});

export type ActivateUserCommandDto = z.infer<
  typeof ActivateUserCommandDtoSchema
>;

export const validateActivateUserCommandDto = (
  data: unknown,
): ActivateUserCommandDto => {
  return ActivateUserCommandDtoSchema.parse(data);
};
