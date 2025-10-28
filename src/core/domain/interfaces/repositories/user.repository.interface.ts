import { User } from '../../entities';
import { CreateUserDto, UpdateUserDto } from '../../dtos';
import { IRepositoryBase } from './base.repository.interface';

export interface IRepositoryUser
  extends IRepositoryBase<User, CreateUserDto, UpdateUserDto> {
  findByEmail(email: string): Promise<User | null>;
  findWithProfile(id: string): Promise<User | null>;
  findByRole(role: string): Promise<User[]>;
  updatePassword(id: string, hashedPassword: string): Promise<User>;
  emailExists(email: string): Promise<boolean>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
