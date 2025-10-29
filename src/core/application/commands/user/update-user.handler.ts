import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { BaseCommandHandler } from '../../common/base.command-handler';
import { UpdateUserCommand } from './update-user.command';
import { USER_REPOSITORY } from '../../../domain/interfaces/repositories';
import type { IRepositoryUser } from '../../../domain/interfaces/repositories';
import { User } from '../../../domain/entities';
import { validateUpdateUserCommandDto } from './dtos';
import { USER_ERRORS, UserStatus } from '../../../../shared/constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdateUserCommandHandler extends BaseCommandHandler<
  UpdateUserCommand,
  User
> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IRepositoryUser,
  ) {
    super();
  }

  async execute(command: UpdateUserCommand): Promise<User> {
    const validatedDto = validateUpdateUserCommandDto(command.dto);

    const existingUser = await this.userRepository.findById(
      validatedDto.userId,
    );
    if (!existingUser) {
      throw new NotFoundException(USER_ERRORS.NOT_FOUND(validatedDto.userId));
    }

    const updateData: {
      email?: string;
      password?: string;
      status?: UserStatus;
    } = {};

    if (validatedDto.email) {
      updateData.email = validatedDto.email;
    }

    if (validatedDto.password) {
      updateData.password = await bcrypt.hash(validatedDto.password, 10);
    }

    if (validatedDto.status) {
      updateData.status = validatedDto.status as UserStatus;
    }

    const updatedUser = await this.userRepository.update(
      validatedDto.userId,
      updateData,
    );

    return updatedUser;
  }
}
