import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BaseQueryHandler } from '../../../common/base.query-handler';
import { GetApplicationByIdQuery } from './get-application-by-id.query';
import { Application } from '../../../../domain/entities/application.entity';
import type { IRepositoryApplication } from '../../../../domain/interfaces/repositories/application.repository.interface';
import { APPLICATION_REPOSITORY } from '../../../../domain/interfaces/repositories/application.repository.interface';
import { UuidSchema } from '../../../../../shared/constants/validation';
import { APPLICATION_ERRORS } from '../../../../../shared/constants/messages';

@Injectable()
export class GetApplicationByIdQueryHandler extends BaseQueryHandler<
  GetApplicationByIdQuery,
  Application
> {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: IRepositoryApplication,
  ) {
    super();
  }

  async query(query: GetApplicationByIdQuery): Promise<Application> {
    UuidSchema.parse(query.applicationId);

    const application = await this.applicationRepository.findById(
      query.applicationId,
    );
    if (!application) {
      throw new NotFoundException(
        APPLICATION_ERRORS.NOT_FOUND(query.applicationId),
      );
    }

    return application;
  }
}
