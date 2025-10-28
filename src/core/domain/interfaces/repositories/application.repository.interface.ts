import { Application } from '../../entities';
import { CreateApplicationDto, UpdateApplicationDto } from '../../dtos';
import { IRepositoryBase } from './base.repository.interface';

export interface IRepositoryApplication
  extends IRepositoryBase<
    Application,
    CreateApplicationDto,
    UpdateApplicationDto
  > {
  findByStudent(studentId: string): Promise<Application[]>;
  findByScholarship(scholarshipId: string): Promise<Application[]>;
  findByStatus(status: string): Promise<Application[]>;
  findWithRelations(id: string): Promise<Application | null>;
  hasApplied(studentId: string, scholarshipId: string): Promise<boolean>;
  countByScholarship(scholarshipId: string): Promise<number>;
}

export const APPLICATION_REPOSITORY = Symbol('APPLICATION_REPOSITORY');
