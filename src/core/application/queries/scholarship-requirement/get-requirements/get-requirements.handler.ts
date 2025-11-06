import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { BaseQueryHandler } from '../../../common';
import { GetRequirementsQuery } from './get-requirements.query';
import {
  SCHOLARSHIP_REQUIREMENT_REPOSITORY,
  IScholarshipRequirementRepository,
} from '../../../../domain/interfaces/repositories';
import { ScholarshipRequirement } from '../../../../domain/entities/scholarship-requirement.entity';

@QueryHandler(GetRequirementsQuery)
export class GetRequirementsQueryHandler extends BaseQueryHandler<
  GetRequirementsQuery,
  ScholarshipRequirement[]
> {
  constructor(
    @Inject(SCHOLARSHIP_REQUIREMENT_REPOSITORY)
    private readonly requirementRepository: IScholarshipRequirementRepository,
  ) {
    super();
  }

  async query(query: GetRequirementsQuery): Promise<ScholarshipRequirement[]> {
    const { scholarshipId } = query;

    const requirements =
      await this.requirementRepository.findByScholarshipId(scholarshipId);

    return requirements;
  }
}
