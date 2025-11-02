import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterCommand } from './register.command';
import { BaseCommandHandler } from '../../common';
import { UserRepository } from '../../../../infras/repositories';
import { User } from '../../../domain/entities';
import { UserRole } from '../../../../shared/constants';
import { CreateUserDto } from '../../../domain/dtos';

@Injectable()
@CommandHandler(RegisterCommand)
export class RegisterCommandHandler
  extends BaseCommandHandler<RegisterCommand, User>
  implements ICommandHandler<RegisterCommand>
{
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  async execute(command: RegisterCommand): Promise<User> {
    const { email, password } = command.data;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(`User with email ${email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUserDto: CreateUserDto = {
      email,
      password: hashedPassword,
      role: UserRole.STUDENT,
    };

    return await this.userRepository.create(createUserDto);
  }
}
