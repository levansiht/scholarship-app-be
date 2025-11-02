import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '../../common/base.command-handler';
import { CreateUserCommand } from './create-user.command';
import { USER_REPOSITORY } from '../../../domain/interfaces/repositories';
import type { IRepositoryUser } from '../../../domain/interfaces/repositories';
import { User } from '../../../domain/entities';
import { validateCreateUserCommandDto } from './dtos';
import { USER_ERRORS } from '../../../../shared/constants';
import * as bcrypt from 'bcrypt';

@Injectable()
@CommandHandler(CreateUserCommand)
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
    const validatedDto = validateCreateUserCommandDto(command.dto);

    const emailExists = await this.userRepository.emailExists(
      validatedDto.email,
    );
    if (emailExists) {
      throw new ConflictException(USER_ERRORS.EMAIL_EXISTS(validatedDto.email));
    }

    const hashedPassword = await bcrypt.hash(validatedDto.password, 10);

    const user = await this.userRepository.create({
      email: validatedDto.email,
      password: hashedPassword,
      role: validatedDto.role,
    });

    return user;
  }
}
