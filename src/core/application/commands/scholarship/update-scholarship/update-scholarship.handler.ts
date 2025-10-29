import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { BaseCommandHandler } from '../../../common/base.command-handler';
import { UpdateScholarshipCommand } from './update-scholarship.command';
import { SCHOLARSHIP_REPOSITORY } from '../../../../domain/interfaces/repositories';
import type { IRepositoryScholarship } from '../../../../domain/interfaces/repositories';
import { Scholarship } from '../../../../domain/entities';
import { UpdateScholarshipDtoSchema } from '../../../../domain/dtos/scholarship.dto.schema';
import { SCHOLARSHIP_ERRORS } from '../../../../../shared/constants';

@Injectable()
export class UpdateScholarshipCommandHandler extends BaseCommandHandler<
  UpdateScholarshipCommand,
  Scholarship
> {
  constructor(
    @Inject(SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: IRepositoryScholarship,
  ) {
    super();
  }

  async execute(command: UpdateScholarshipCommand): Promise<Scholarship> {
    const validatedDto = UpdateScholarshipDtoSchema.parse(command.dto);

    const existingScholarship = await this.scholarshipRepository.findById(
      command.scholarshipId,
    );
    if (!existingScholarship) {
      throw new NotFoundException(
        SCHOLARSHIP_ERRORS.NOT_FOUND(command.scholarshipId),
      );
    }

    const scholarship = await this.scholarshipRepository.update(
      command.scholarshipId,
      validatedDto,
    );

    return scholarship;
  }
}
