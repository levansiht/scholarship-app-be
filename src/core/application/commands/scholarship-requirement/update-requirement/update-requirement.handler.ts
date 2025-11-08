import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '../../../common';
import { UpdateRequirementCommand } from './update-requirement.command';
import {
  SCHOLARSHIP_REQUIREMENT_REPOSITORY,
  IScholarshipRequirementRepository,
} from '../../../../domain/interfaces/repositories';
import { ScholarshipRequirement } from '../../../../domain/entities/scholarship-requirement.entity';

@CommandHandler(UpdateRequirementCommand)
export class UpdateRequirementCommandHandler extends BaseCommandHandler<
  UpdateRequirementCommand,
  ScholarshipRequirement
> {
  constructor(
    @Inject(SCHOLARSHIP_REQUIREMENT_REPOSITORY)
    private readonly requirementRepository: IScholarshipRequirementRepository,
  ) {
    super();
  }

  async execute(
    command: UpdateRequirementCommand,
  ): Promise<ScholarshipRequirement> {
    const { requirementId, data } = command;

    const updated = await this.requirementRepository.update(
      requirementId,
      data,
    );

    return updated;
  }
}
