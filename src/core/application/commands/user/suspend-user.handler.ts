import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '../../common/base.command-handler';
import { SuspendUserCommand } from './suspend-user.command';
import { USER_REPOSITORY } from '../../../domain/interfaces/repositories';
import type { IRepositoryUser } from '../../../domain/interfaces/repositories';
import { User } from '../../../domain/entities';
import { validateSuspendUserCommandDto } from './dtos';
import { USER_ERRORS, UserStatus } from '../../../../shared/constants';

@Injectable()
@CommandHandler(SuspendUserCommand)
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
    const validatedDto = validateSuspendUserCommandDto(command.dto);

    const user = await this.userRepository.findById(validatedDto.userId);
    if (!user) {
      throw new NotFoundException(USER_ERRORS.NOT_FOUND(validatedDto.userId));
    }

    user.suspend();

    const updatedUser = await this.userRepository.update(validatedDto.userId, {
      status: UserStatus.SUSPENDED,
    });

    return updatedUser;
  }
}
