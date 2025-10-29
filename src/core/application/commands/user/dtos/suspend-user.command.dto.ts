import { z } from 'zod';
import { UserIdSchema } from './user-command.constants';

export const SuspendUserCommandDtoSchema = z.object({
  userId: UserIdSchema,
  reason: z
    .string()
    .min(10, 'Suspension reason must be at least 10 characters')
    .max(500, 'Suspension reason must not exceed 500 characters'),
});

export type SuspendUserCommandDto = z.infer<typeof SuspendUserCommandDtoSchema>;

export const validateSuspendUserCommandDto = (
  data: unknown,
): SuspendUserCommandDto => {
  return SuspendUserCommandDtoSchema.parse(data);
};
