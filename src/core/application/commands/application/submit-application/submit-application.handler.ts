import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '../../../common/base.command-handler';
import { SubmitApplicationCommand } from './submit-application.command';
import { Application } from '../../../../domain/entities/application.entity';
import type { IRepositoryApplication } from '../../../../domain/interfaces/repositories/application.repository.interface';
import { APPLICATION_REPOSITORY } from '../../../../domain/interfaces/repositories/application.repository.interface';
import type { IRepositoryScholarship } from '../../../../domain/interfaces/repositories/scholarship.repository.interface';
import { SCHOLARSHIP_REPOSITORY } from '../../../../domain/interfaces/repositories/scholarship.repository.interface';
import {
  APPLICATION_ERRORS,
  SCHOLARSHIP_ERRORS,
} from '../../../../../shared/constants/messages';
import { CreateApplicationDtoSchema } from '../../../../domain/dtos/application.dto.schema';
import { ApplicationStatus } from '../../../../../shared/constants';

@Injectable()
@CommandHandler(SubmitApplicationCommand)
export class SubmitApplicationCommandHandler extends BaseCommandHandler<
  SubmitApplicationCommand,
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

  async execute(command: SubmitApplicationCommand): Promise<Application> {
    const validatedData = CreateApplicationDtoSchema.parse(command.data);

    const scholarship = await this.scholarshipRepository.findById(
      validatedData.scholarshipId,
    );
    if (!scholarship) {
      throw new NotFoundException(
        SCHOLARSHIP_ERRORS.NOT_FOUND(validatedData.scholarshipId),
      );
    }

    if (!scholarship.isOpen()) {
      throw new BadRequestException(APPLICATION_ERRORS.SCHOLARSHIP_CLOSED);
    }

    const hasApplied = await this.applicationRepository.hasApplied(
      validatedData.applicantId,
      validatedData.scholarshipId,
    );
    if (hasApplied) {
      throw new ConflictException(APPLICATION_ERRORS.DUPLICATE_APPLICATION);
    }

    const currentApplications =
      await this.applicationRepository.countByScholarship(
        validatedData.scholarshipId,
      );
    if (
      scholarship.numberOfSlots > 0 &&
      currentApplications >= scholarship.numberOfSlots
    ) {
      throw new BadRequestException(APPLICATION_ERRORS.NO_SLOTS);
    }

    const application = Application.create({
      id: crypto.randomUUID(),
      scholarshipId: validatedData.scholarshipId,
      applicantId: validatedData.applicantId,
      status: ApplicationStatus.DRAFT,
      coverLetter: validatedData.coverLetter ?? null,
      additionalInfo: validatedData.additionalInfo ?? null,
      submittedAt: null,
      reviewedAt: null,
      decidedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    application.submit();

    const createDto = {
      scholarshipId: application.scholarshipId,
      applicantId: application.applicantId,
      coverLetter: application.coverLetter || undefined,
      additionalInfo: application.additionalInfo || undefined,
    };

    const created = await this.applicationRepository.create(createDto);

    return await this.applicationRepository.update(created.id, {
      status: ApplicationStatus.SUBMITTED,
    });
  }
}
