import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SetEligibilityCriteriaCommand } from './set-eligibility-criteria.command';
import { Inject } from '@nestjs/common';
import {
  IEligibilityCriteriaRepository,
  ELIGIBILITY_CRITERIA_REPOSITORY,
} from '../../../domain/interfaces/repositories';
import { EligibilityCriteria } from '../../../domain/entities';

@CommandHandler(SetEligibilityCriteriaCommand)
export class SetEligibilityCriteriaHandler
  implements ICommandHandler<SetEligibilityCriteriaCommand, EligibilityCriteria>
{
  constructor(
    @Inject(ELIGIBILITY_CRITERIA_REPOSITORY)
    private readonly criteriaRepository: IEligibilityCriteriaRepository,
  ) {}

  async execute(
    command: SetEligibilityCriteriaCommand,
  ): Promise<EligibilityCriteria> {
    return this.criteriaRepository.set({
      scholarshipId: command.scholarshipId,
      minGpa: command.minGpa,
      maxGpa: command.maxGpa,
      allowedMajors: command.allowedMajors ?? [],
      allowedYearOfStudy: command.allowedYearOfStudy ?? [],
      minAge: command.minAge,
      maxAge: command.maxAge,
      requiredNationality: command.requiredNationality,
      otherRequirements: command.otherRequirements,
    });
  }
}
