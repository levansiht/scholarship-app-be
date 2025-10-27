import { BaseRepositoryInterface } from './base.repository.interface';

export interface ApplicationRepositoryInterface<T = unknown>
  extends BaseRepositoryInterface<T> {
  findByStudent(studentId: string): Promise<T[]>;
  findByScholarship(scholarshipId: string): Promise<T[]>;
  findByStatus(status: string): Promise<T[]>;
  findWithRelations(id: string): Promise<T | null>;
  hasApplied(studentId: string, scholarshipId: string): Promise<boolean>;
  updateStatus(id: string, status: string): Promise<void>;
  submit(id: string): Promise<void>;
  approve(id: string): Promise<void>;
  reject(id: string, reason?: string): Promise<void>;
  countByScholarship(scholarshipId: string): Promise<number>;
}

export const APPLICATION_REPOSITORY = Symbol('APPLICATION_REPOSITORY');
