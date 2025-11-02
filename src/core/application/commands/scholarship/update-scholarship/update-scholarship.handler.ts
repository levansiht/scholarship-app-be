import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '../../../common/base.command-handler';
import { UpdateScholarshipCommand } from './update-scholarship.command';
import { SCHOLARSHIP_REPOSITORY } from '../../../../domain/interfaces/repositories';
import type { IRepositoryScholarship } from '../../../../domain/interfaces/repositories';
import { Scholarship } from '../../../../domain/entities';
import { UpdateScholarshipDtoSchema } from '../../../../domain/dtos/scholarship.dto.schema';
import { SCHOLARSHIP_ERRORS, UserRole } from '../../../../../shared/constants';

@Injectable()
@CommandHandler(UpdateScholarshipCommand)
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

    if (
      command.userRole === UserRole.SPONSOR &&
      existingScholarship.createdBy !== command.userId
    ) {
      throw new ForbiddenException(
        'You can only update scholarships created by you',
      );
    }

    const scholarship = await this.scholarshipRepository.update(
      command.scholarshipId,
      validatedDto,
    );

    return scholarship;
  }
}
