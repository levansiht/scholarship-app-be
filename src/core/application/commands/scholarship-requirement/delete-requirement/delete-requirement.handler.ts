import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '../../../common';
import { DeleteRequirementCommand } from './delete-requirement.command';
import {
  SCHOLARSHIP_REQUIREMENT_REPOSITORY,
  IScholarshipRequirementRepository,
} from '../../../../domain/interfaces/repositories';

@CommandHandler(DeleteRequirementCommand)
export class DeleteRequirementCommandHandler extends BaseCommandHandler<
  DeleteRequirementCommand,
  void
> {
  constructor(
    @Inject(SCHOLARSHIP_REQUIREMENT_REPOSITORY)
    private readonly requirementRepository: IScholarshipRequirementRepository,
  ) {
    super();
  }

  async execute(command: DeleteRequirementCommand): Promise<void> {
    const { requirementId } = command;

    await this.requirementRepository.delete(requirementId);
  }
}
