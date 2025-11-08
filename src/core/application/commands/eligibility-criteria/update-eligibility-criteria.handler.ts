import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateEligibilityCriteriaCommand } from './update-eligibility-criteria.command';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  IEligibilityCriteriaRepository,
  ELIGIBILITY_CRITERIA_REPOSITORY,
} from '../../../domain/interfaces/repositories';
import { EligibilityCriteria } from '../../../domain/entities';

@CommandHandler(UpdateEligibilityCriteriaCommand)
export class UpdateEligibilityCriteriaHandler
  implements
    ICommandHandler<UpdateEligibilityCriteriaCommand, EligibilityCriteria>
{
  constructor(
    @Inject(ELIGIBILITY_CRITERIA_REPOSITORY)
    private readonly criteriaRepository: IEligibilityCriteriaRepository,
  ) {}

  async execute(
    command: UpdateEligibilityCriteriaCommand,
  ): Promise<EligibilityCriteria> {
    const existing = await this.criteriaRepository.findByScholarshipId(
      command.scholarshipId,
    );

    if (!existing) {
      throw new NotFoundException(
        `Eligibility criteria not found for scholarship ${command.scholarshipId}`,
      );
    }

    const updateData: Record<string, any> = {};
    if (command.minGpa !== undefined) updateData.minGpa = command.minGpa;
    if (command.maxGpa !== undefined) updateData.maxGpa = command.maxGpa;
    if (command.allowedMajors !== undefined)
      updateData.allowedMajors = command.allowedMajors;
    if (command.allowedYearOfStudy !== undefined)
      updateData.allowedYearOfStudy = command.allowedYearOfStudy;
    if (command.minAge !== undefined) updateData.minAge = command.minAge;
    if (command.maxAge !== undefined) updateData.maxAge = command.maxAge;
    if (command.requiredNationality !== undefined)
      updateData.requiredNationality = command.requiredNationality;
    if (command.otherRequirements !== undefined)
      updateData.otherRequirements = command.otherRequirements;

    return this.criteriaRepository.update(command.scholarshipId, updateData);
  }
}
