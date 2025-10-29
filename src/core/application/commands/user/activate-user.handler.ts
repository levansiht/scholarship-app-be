import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { BaseCommandHandler } from '../../common/base.command-handler';
import { ActivateUserCommand } from './activate-user.command';
import { USER_REPOSITORY } from '../../../domain/interfaces/repositories';
import type { IRepositoryUser } from '../../../domain/interfaces/repositories';
import { User } from '../../../domain/entities';
import { validateActivateUserCommandDto } from './dtos';
import { USER_ERRORS, UserStatus } from '../../../../shared/constants';

/**
 * Activate User Command Handler
 * Handles user account activation
 *
 * Business Rules:
 * 1. User must exist
 * 2. User activate() domain method handles business logic
 * 3. Changes are persisted through repository
 */
@Injectable()
export class ActivateUserCommandHandler extends BaseCommandHandler<
  ActivateUserCommand,
  User
> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IRepositoryUser,
  ) {
    super();
  }

  async execute(command: ActivateUserCommand): Promise<User> {
    // 1. Validate command DTO
    const validatedDto = validateActivateUserCommandDto(command.dto);

    // 2. Find user
    const user = await this.userRepository.findById(validatedDto.userId);
    if (!user) {
      throw new NotFoundException(USER_ERRORS.NOT_FOUND(validatedDto.userId));
    }

    // 3. Call domain method (contains business logic)
    user.activate();

    // 4. Persist changes
    const updatedUser = await this.userRepository.update(validatedDto.userId, {
      status: UserStatus.ACTIVE,
    });

    return updatedUser;
  }
}
