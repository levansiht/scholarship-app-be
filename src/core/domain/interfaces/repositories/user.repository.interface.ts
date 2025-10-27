import { BaseRepositoryInterface } from './base.repository.interface';

export interface UserRepositoryInterface<T = unknown>
  extends BaseRepositoryInterface<T> {
  findByEmail(email: string): Promise<T | null>;
  findWithProfile(id: string): Promise<T | null>;
  findByRole(role: string): Promise<T[]>;
  updatePassword(id: string, hashedPassword: string): Promise<void>;
  verifyEmail(id: string): Promise<void>;
  emailExists(email: string): Promise<boolean>;
  suspend(id: string): Promise<void>;
  activate(id: string): Promise<void>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
