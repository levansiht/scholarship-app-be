import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '../../../common/base.command-handler';
import { RejectApplicationCommand } from './reject-application.command';
import { Application } from '../../../../domain/entities/application.entity';
import type { IRepositoryApplication } from '../../../../domain/interfaces/repositories/application.repository.interface';
import { APPLICATION_REPOSITORY } from '../../../../domain/interfaces/repositories/application.repository.interface';
import type { IRepositoryScholarship } from '../../../../domain/interfaces/repositories/scholarship.repository.interface';
import { SCHOLARSHIP_REPOSITORY } from '../../../../domain/interfaces/repositories/scholarship.repository.interface';
import { APPLICATION_ERRORS } from '../../../../../shared/constants/messages';
import { UuidSchema } from '../../../../../shared/constants/validation';
import { ApplicationStatus, UserRole } from '../../../../../shared/constants';

@Injectable()
@CommandHandler(RejectApplicationCommand)
export class RejectApplicationCommandHandler extends BaseCommandHandler<
  RejectApplicationCommand,
  Application
> {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: IRepositoryApplication,
    @Inject(SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: IRepositoryScholarship,
  ) {
    super();
  }

  async execute(command: RejectApplicationCommand): Promise<Application> {
    // Validate UUID
    UuidSchema.parse(command.applicationId);

    // Find application
    const application = await this.applicationRepository.findById(
      command.applicationId,
    );
    if (!application) {
      throw new NotFoundException(
        APPLICATION_ERRORS.NOT_FOUND(command.applicationId),
      );
    }

    // Ownership check: SPONSOR can only reject applications for their own scholarships
    if (command.userRole === UserRole.SPONSOR) {
      const scholarship = await this.scholarshipRepository.findById(
        application.scholarshipId,
      );
      if (!scholarship) {
        throw new NotFoundException('Scholarship not found');
      }
      if (scholarship.createdBy !== command.userId) {
        throw new ForbiddenException(
          'You can only reject applications for scholarships you created',
        );
      }
    }

    // Call domain logic
    try {
      application.reject();
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Cannot reject application',
      );
    }

    // Persist status change
    return await this.applicationRepository.update(application.id, {
      status: ApplicationStatus.REJECTED,
    });
  }
}
