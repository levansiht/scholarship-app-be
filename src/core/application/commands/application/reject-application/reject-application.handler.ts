import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '../../../common/base.command-handler';
import { RejectApplicationCommand } from './reject-application.command';
import { Application } from '../../../../domain/entities/application.entity';
import type { IRepositoryApplication } from '../../../../domain/interfaces/repositories/application.repository.interface';
import { APPLICATION_REPOSITORY } from '../../../../domain/interfaces/repositories/application.repository.interface';
import { APPLICATION_ERRORS } from '../../../../../shared/constants/messages';
import { UuidSchema } from '../../../../../shared/constants/validation';
import { ApplicationStatus } from '../../../../../shared/constants';

@Injectable()
@CommandHandler(RejectApplicationCommand)
export class RejectApplicationCommandHandler extends BaseCommandHandler<
  RejectApplicationCommand,
  Application
> {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: IRepositoryApplication,
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
