import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '../../../common/base.command-handler';
import { CloseScholarshipCommand } from './close-scholarship.command';
import { SCHOLARSHIP_REPOSITORY } from '../../../../domain/interfaces/repositories';
import type { IRepositoryScholarship } from '../../../../domain/interfaces/repositories';
import { Scholarship, ScholarshipStatus } from '../../../../domain/entities';
import { SCHOLARSHIP_ERRORS } from '../../../../../shared/constants';

@Injectable()
@CommandHandler(CloseScholarshipCommand)
export class CloseScholarshipCommandHandler extends BaseCommandHandler<
  CloseScholarshipCommand,
  Scholarship
> {
  constructor(
    @Inject(SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: IRepositoryScholarship,
  ) {
    super();
  }

  async execute(command: CloseScholarshipCommand): Promise<Scholarship> {
    const scholarship = await this.scholarshipRepository.findById(
      command.scholarshipId,
    );
    if (!scholarship) {
      throw new NotFoundException(
        SCHOLARSHIP_ERRORS.NOT_FOUND(command.scholarshipId),
      );
    }

    try {
      scholarship.close();
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Cannot close scholarship',
      );
    }

    const updatedScholarship = await this.scholarshipRepository.update(
      command.scholarshipId,
      {
        status: ScholarshipStatus.CLOSED,
      },
    );

    return updatedScholarship;
  }
}
