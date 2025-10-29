import { Scholarship } from '../../entities';
import { CreateScholarshipDto, UpdateScholarshipDto } from '../../dtos';
import { IRepositoryBase } from './base.repository.interface';

export interface IRepositoryScholarship
  extends IRepositoryBase<
    Scholarship,
    CreateScholarshipDto,
    UpdateScholarshipDto
  > {
  findBySlug(slug: string): Promise<Scholarship | null>;
  findBySponsor(sponsorId: string): Promise<Scholarship[]>;
  findActive(): Promise<Scholarship[]>;
  findByStatus(status: string): Promise<Scholarship[]>;
  search(keyword: string): Promise<Scholarship[]>;
  findByCategory(categoryId: string): Promise<Scholarship[]>;
  findWithRelations(id: string): Promise<Scholarship | null>;
  belongsToSponsor(scholarshipId: string, sponsorId: string): Promise<boolean>;
}

export const SCHOLARSHIP_REPOSITORY = Symbol('SCHOLARSHIP_REPOSITORY');
