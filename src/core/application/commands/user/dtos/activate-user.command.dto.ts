import { z } from 'zod';
import { UuidSchema as UserIdSchema } from '../../../../../shared/constants';

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
