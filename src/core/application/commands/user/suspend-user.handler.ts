import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { BaseCommandHandler } from '../../common/base.command-handler';
import { SuspendUserCommand } from './suspend-user.command';
import { USER_REPOSITORY } from '../../../domain/interfaces/repositories';
import type { IRepositoryUser } from '../../../domain/interfaces/repositories';
import { User } from '../../../domain/entities';
import { validateSuspendUserCommandDto } from './dtos';
import { USER_ERRORS, UserStatus } from '../../../../shared/constants';

/**
 * Suspend User Command Handler
 * Handles user account suspension
 *
 * Business Rules:
 * 1. User must exist
 * 2. Suspension reason must be provided (validated by DTO)
 * 3. User suspend() domain method handles business logic
 * 4. Changes are persisted through repository
 */
@Injectable()
export class SuspendUserCommandHandler extends BaseCommandHandler<
  SuspendUserCommand,
  User
> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IRepositoryUser,
  ) {
    super();
  }

  async execute(command: SuspendUserCommand): Promise<User> {
    // 1. Validate command DTO
    const validatedDto = validateSuspendUserCommandDto(command.dto);

    // 2. Find user
    const user = await this.userRepository.findById(validatedDto.userId);
    if (!user) {
      throw new NotFoundException(USER_ERRORS.NOT_FOUND(validatedDto.userId));
    }

    // 3. Call domain method
    // Note: Suspension reason is validated in DTO but not stored in entity yet
    // Future: Consider adding a suspensionReason field to User entity
    user.suspend();

    // 4. Persist changes
    const updatedUser = await this.userRepository.update(validatedDto.userId, {
      status: UserStatus.SUSPENDED,
    });

    return updatedUser;
  }
}
