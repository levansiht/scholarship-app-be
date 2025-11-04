import { ScholarshipCategory } from '../../entities';

export interface IScholarshipCategoryRepository {
  create(scholarshipId: string, name: string): Promise<ScholarshipCategory>;

  delete(scholarshipId: string, categoryId: string): Promise<void>;

  findByScholarshipId(scholarshipId: string): Promise<ScholarshipCategory[]>;

  findAll(): Promise<string[]>;

  exists(scholarshipId: string, name: string): Promise<boolean>;
}

export const SCHOLARSHIP_CATEGORY_REPOSITORY =
  'SCHOLARSHIP_CATEGORY_REPOSITORY';
