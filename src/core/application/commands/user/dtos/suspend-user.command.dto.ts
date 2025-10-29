import { z } from 'zod';
import {
  UuidSchema as UserIdSchema,
  USER_VALIDATION_MESSAGES as MSG,
} from '../../../../../shared/constants';

export const SuspendUserCommandDtoSchema = z.object({
  userId: UserIdSchema,
  reason: z
    .string()
    .min(10, MSG.SUSPENSION_REASON.MIN_LENGTH)
    .max(500, MSG.SUSPENSION_REASON.MAX_LENGTH),
});

export type SuspendUserCommandDto = z.infer<typeof SuspendUserCommandDtoSchema>;

export const validateSuspendUserCommandDto = (
  data: unknown,
): SuspendUserCommandDto => {
  return SuspendUserCommandDtoSchema.parse(data);
};
