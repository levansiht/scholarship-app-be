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

/**
 * Change Password Command Handler
 * Handles user password change with verification
 *
 * Business Rules:
 * 1. User must exist
 * 2. Old password must be correct (verified)
 * 3. New password must be different from old password
 * 4. New password must be hashed before storing
 * 5. User changePassword() domain method is called
 */
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
    // 1. Validate command DTO
    const validatedDto = validateChangePasswordCommandDto(command.dto);

    // 2. Find user
    const user = await this.userRepository.findById(validatedDto.userId);
    if (!user) {
      throw new NotFoundException(USER_ERRORS.NOT_FOUND(validatedDto.userId));
    }

    // 3. Verify old password
    const isOldPasswordValid = await bcrypt.compare(
      validatedDto.oldPassword,
      user.password.value,
    );
    if (!isOldPasswordValid) {
      throw new UnauthorizedException(USER_ERRORS.OLD_PASSWORD_INCORRECT);
    }

    // 4. Check if new password is different
    if (validatedDto.oldPassword === validatedDto.newPassword) {
      throw new BadRequestException(USER_ERRORS.PASSWORD_MUST_DIFFER);
    }

    // 5. Create new password value object
    const newPasswordVO = Password.create(validatedDto.newPassword);

    // 6. Call domain method
    user.changePassword(newPasswordVO);

    // 7. Hash new password and persist
    const hashedNewPassword = await bcrypt.hash(validatedDto.newPassword, 10);
    const updatedUser = await this.userRepository.updatePassword(
      validatedDto.userId,
      hashedNewPassword,
    );

    return updatedUser;
  }
}
