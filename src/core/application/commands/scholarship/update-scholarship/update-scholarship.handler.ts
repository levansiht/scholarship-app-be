import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '../../../common/base.command-handler';
import { UpdateScholarshipCommand } from './update-scholarship.command';
import { SCHOLARSHIP_REPOSITORY } from '../../../../domain/interfaces/repositories';
import type { IRepositoryScholarship } from '../../../../domain/interfaces/repositories';
import type { IRepositoryApplication } from '../../../../domain/interfaces/repositories/application.repository.interface';
import { APPLICATION_REPOSITORY } from '../../../../domain/interfaces/repositories/application.repository.interface';
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
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: IRepositoryApplication,
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

    const applicationCount =
      await this.applicationRepository.countByScholarship(
        command.scholarshipId,
      );

    if (
      validatedDto.numberOfSlots !== undefined &&
      validatedDto.numberOfSlots < applicationCount
    ) {
      throw new BadRequestException(
        `Cannot reduce slots to ${validatedDto.numberOfSlots} because there are already ${applicationCount} applications`,
      );
    }

    const scholarship = await this.scholarshipRepository.update(
      command.scholarshipId,
      validatedDto,
    );

    return scholarship;
  }
}
