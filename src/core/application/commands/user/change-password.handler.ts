import {
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { BaseCommandHandler } from '../../common/base.command-handler';
import { ChangePasswordCommand } from './change-password.command';
import { USER_REPOSITORY } from '../../../domain/interfaces/repositories';
import type { IRepositoryUser } from '../../../domain/interfaces/repositories';
import { User } from '../../../domain/entities';
import { Password } from '../../../domain/value-objects';
import { validateChangePasswordCommandDto } from './dtos';
import { USER_ERRORS } from '../../../../shared/constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChangePasswordCommandHandler extends BaseCommandHandler<
  ChangePasswordCommand,
  User
> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IRepositoryUser,
  ) {
    super();
  }

  async execute(command: ChangePasswordCommand): Promise<User> {
    const validatedDto = validateChangePasswordCommandDto(command.dto);
    const user = await this.userRepository.findById(validatedDto.userId);
    if (!user) {
      throw new NotFoundException(USER_ERRORS.NOT_FOUND(validatedDto.userId));
    }

    const isOldPasswordValid = await bcrypt.compare(
      validatedDto.oldPassword,
      user.password.value,
    );
    if (!isOldPasswordValid) {
      throw new UnauthorizedException(USER_ERRORS.OLD_PASSWORD_INCORRECT);
    }

    if (validatedDto.oldPassword === validatedDto.newPassword) {
      throw new BadRequestException(USER_ERRORS.PASSWORD_MUST_DIFFER);
    }

    const newPasswordVO = Password.create(validatedDto.newPassword);

    user.changePassword(newPasswordVO);

    const hashedNewPassword = await bcrypt.hash(validatedDto.newPassword, 10);
    const updatedUser = await this.userRepository.updatePassword(
      validatedDto.userId,
      hashedNewPassword,
    );

    return updatedUser;
  }
}
