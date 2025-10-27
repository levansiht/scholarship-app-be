import { BaseRepositoryInterface } from './base.repository.interface';

export interface ScholarshipRepositoryInterface<T = unknown>
  extends BaseRepositoryInterface<T> {
  findBySponsor(sponsorId: string): Promise<T[]>;
  findActive(): Promise<T[]>;
  findByStatus(status: string): Promise<T[]>;
  search(keyword: string): Promise<T[]>;
  findByCategory(categoryId: string): Promise<T[]>;
  findWithRelations(id: string): Promise<T | null>;
  publish(id: string): Promise<void>;
  close(id: string): Promise<void>;
  belongsToSponsor(scholarshipId: string, sponsorId: string): Promise<boolean>;
}

export const SCHOLARSHIP_REPOSITORY = Symbol('SCHOLARSHIP_REPOSITORY');
