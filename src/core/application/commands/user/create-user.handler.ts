import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { BaseCommandHandler } from '../../common/base.command-handler';
import { CreateUserCommand } from './create-user.command';
import { USER_REPOSITORY } from '../../../domain/interfaces/repositories';
import type { IRepositoryUser } from '../../../domain/interfaces/repositories';
import { User } from '../../../domain/entities';
import { validateCreateUserCommandDto } from './dtos';
import { USER_ERRORS } from '../../../../shared/constants';
import * as bcrypt from 'bcrypt';

/**
 * Create User Command Handler
 * Handles the creation of a new user
 *
 * Business Rules:
 * 1. Email must be unique (not already registered)
 * 2. Password must be hashed before storing
 * 3. User starts with INACTIVE status by default
 */
@Injectable()
export class CreateUserCommandHandler extends BaseCommandHandler<
  CreateUserCommand,
  User
> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IRepositoryUser,
  ) {
    super();
  }

  async execute(command: CreateUserCommand): Promise<User> {
    // 1. Validate command DTO
    const validatedDto = validateCreateUserCommandDto(command.dto);

    // 2. Check if email already exists
    const emailExists = await this.userRepository.emailExists(
      validatedDto.email,
    );
    if (emailExists) {
      throw new ConflictException(USER_ERRORS.EMAIL_EXISTS(validatedDto.email));
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(validatedDto.password, 10);

    // 4. Create user through repository
    const user = await this.userRepository.create({
      email: validatedDto.email,
      password: hashedPassword,
      role: validatedDto.role,
    });

    return user;
  }
}
