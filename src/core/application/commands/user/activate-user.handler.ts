import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '../../common/base.command-handler';
import { ActivateUserCommand } from './activate-user.command';
import { USER_REPOSITORY } from '../../../domain/interfaces/repositories';
import type { IRepositoryUser } from '../../../domain/interfaces/repositories';
import { User } from '../../../domain/entities';
import { validateActivateUserCommandDto } from './dtos';
import { USER_ERRORS, UserStatus } from '../../../../shared/constants';

@Injectable()
@CommandHandler(ActivateUserCommand)
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
    const validatedDto = validateActivateUserCommandDto(command.dto);

    const user = await this.userRepository.findById(validatedDto.userId);
    if (!user) {
      throw new NotFoundException(USER_ERRORS.NOT_FOUND(validatedDto.userId));
    }
    user.activate();

    const updatedUser = await this.userRepository.update(validatedDto.userId, {
      status: UserStatus.ACTIVE,
    });

    return updatedUser;
  }
}
