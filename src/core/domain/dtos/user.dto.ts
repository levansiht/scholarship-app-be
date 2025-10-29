import { UserRole, UserStatus } from '../../../shared/constants';

export interface CreateUserDto {
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  status?: UserStatus;
}

export interface UserFilterDto {
  role?: UserRole;
  status?: UserStatus;
  email?: string;
}
