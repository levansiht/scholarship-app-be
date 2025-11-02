import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '../../../common/base.command-handler';
import { PublishScholarshipCommand } from './publish-scholarship.command';
import { SCHOLARSHIP_REPOSITORY } from '../../../../domain/interfaces/repositories';
import type { IRepositoryScholarship } from '../../../../domain/interfaces/repositories';
import { Scholarship, ScholarshipStatus } from '../../../../domain/entities';
import { SCHOLARSHIP_ERRORS, UserRole } from '../../../../../shared/constants';

@Injectable()
@CommandHandler(PublishScholarshipCommand)
export class PublishScholarshipCommandHandler extends BaseCommandHandler<
  PublishScholarshipCommand,
  Scholarship
> {
  constructor(
    @Inject(SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: IRepositoryScholarship,
  ) {
    super();
  }

  async execute(command: PublishScholarshipCommand): Promise<Scholarship> {
    const scholarship = await this.scholarshipRepository.findById(
      command.scholarshipId,
    );
    if (!scholarship) {
      throw new NotFoundException(
        SCHOLARSHIP_ERRORS.NOT_FOUND(command.scholarshipId),
      );
    }

    if (
      command.userRole === UserRole.SPONSOR &&
      scholarship.createdBy !== command.userId
    ) {
      throw new ForbiddenException(
        'You can only publish scholarships created by you',
      );
    }

    try {
      scholarship.publish();
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Cannot publish scholarship',
      );
    }

    const updatedScholarship = await this.scholarshipRepository.update(
      command.scholarshipId,
      {
        status: ScholarshipStatus.OPEN,
      },
    );

    return updatedScholarship;
  }
}
