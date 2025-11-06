import { ScholarshipRequirement } from '../../entities/scholarship-requirement.entity';

export interface CreateRequirementData {
  scholarshipId: string;
  title: string;
  description: string;
  isRequired?: boolean;
  displayOrder?: number;
}

export interface UpdateRequirementData {
  title?: string;
  description?: string;
  isRequired?: boolean;
  displayOrder?: number;
}

export interface IScholarshipRequirementRepository {
  create(data: CreateRequirementData): Promise<ScholarshipRequirement>;
  findById(id: string): Promise<ScholarshipRequirement | null>;
  findByScholarshipId(scholarshipId: string): Promise<ScholarshipRequirement[]>;
  update(
    id: string,
    data: UpdateRequirementData,
  ): Promise<ScholarshipRequirement>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}

export const SCHOLARSHIP_REQUIREMENT_REPOSITORY =
  'SCHOLARSHIP_REQUIREMENT_REPOSITORY';
