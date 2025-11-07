import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetEligibilityCriteriaQuery } from './get-eligibility-criteria.query';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  IEligibilityCriteriaRepository,
  ELIGIBILITY_CRITERIA_REPOSITORY,
} from '../../../domain/interfaces/repositories';
import { EligibilityCriteria } from '../../../domain/entities';

@QueryHandler(GetEligibilityCriteriaQuery)
export class GetEligibilityCriteriaHandler
  implements IQueryHandler<GetEligibilityCriteriaQuery, EligibilityCriteria>
{
  constructor(
    @Inject(ELIGIBILITY_CRITERIA_REPOSITORY)
    private readonly criteriaRepository: IEligibilityCriteriaRepository,
  ) {}

  async execute(
    query: GetEligibilityCriteriaQuery,
  ): Promise<EligibilityCriteria> {
    const criteria = await this.criteriaRepository.findByScholarshipId(
      query.scholarshipId,
    );

    if (!criteria) {
      throw new NotFoundException(
        `Eligibility criteria not found for scholarship ${query.scholarshipId}`,
      );
    }

    return criteria;
  }
}
