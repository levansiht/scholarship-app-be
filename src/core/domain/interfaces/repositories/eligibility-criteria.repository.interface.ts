import { EligibilityCriteria } from '../../entities/eligibility-criteria.entity';
import { Prisma } from '@prisma/client';

export interface SetCriteriaData {
  scholarshipId: string;
  minGpa?: number;
  maxGpa?: number;
  allowedMajors: string[];
  allowedYearOfStudy: number[];
  minAge?: number;
  maxAge?: number;
  requiredNationality?: string;
  otherRequirements?: Prisma.InputJsonValue;
}

export interface UpdateCriteriaData {
  minGpa?: number;
  maxGpa?: number;
  allowedMajors?: string[];
  allowedYearOfStudy?: number[];
  minAge?: number;
  maxAge?: number;
  requiredNationality?: string;
  otherRequirements?: Prisma.InputJsonValue;
}

export interface IEligibilityCriteriaRepository {
  set(data: SetCriteriaData): Promise<EligibilityCriteria>;
  findByScholarshipId(
    scholarshipId: string,
  ): Promise<EligibilityCriteria | null>;
  update(
    scholarshipId: string,
    data: UpdateCriteriaData,
  ): Promise<EligibilityCriteria>;
  delete(scholarshipId: string): Promise<void>;
}

export const ELIGIBILITY_CRITERIA_REPOSITORY = Symbol(
  'ELIGIBILITY_CRITERIA_REPOSITORY',
);
