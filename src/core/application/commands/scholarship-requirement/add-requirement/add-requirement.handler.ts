import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '../../../common';
import { AddRequirementCommand } from './add-requirement.command';
import {
  SCHOLARSHIP_REQUIREMENT_REPOSITORY,
  IScholarshipRequirementRepository,
  SCHOLARSHIP_REPOSITORY,
  IRepositoryScholarship,
} from '../../../../domain/interfaces/repositories';
import { ScholarshipRequirement } from '../../../../domain/entities/scholarship-requirement.entity';

@CommandHandler(AddRequirementCommand)
export class AddRequirementCommandHandler extends BaseCommandHandler<
  AddRequirementCommand,
  ScholarshipRequirement
> {
  constructor(
    @Inject(SCHOLARSHIP_REQUIREMENT_REPOSITORY)
    private readonly requirementRepository: IScholarshipRequirementRepository,
    @Inject(SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: IRepositoryScholarship,
  ) {
    super();
  }

  async execute(
    command: AddRequirementCommand,
  ): Promise<ScholarshipRequirement> {
    const { scholarshipId, title, description, isRequired, displayOrder } =
      command.data;

    const scholarship =
      await this.scholarshipRepository.findById(scholarshipId);
    if (!scholarship) {
      throw new NotFoundException(
        `Scholarship with ID ${scholarshipId} not found`,
      );
    }

    const requirement = await this.requirementRepository.create({
      scholarshipId,
      title,
      description,
      isRequired,
      displayOrder,
    });

    return requirement;
  }
}
