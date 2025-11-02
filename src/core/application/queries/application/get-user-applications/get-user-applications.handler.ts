import { Inject, Injectable } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { BaseQueryHandler } from '../../../common/base.query-handler';
import { GetUserApplicationsQuery } from './get-user-applications.query';
import { Application } from '../../../../domain/entities/application.entity';
import type { IRepositoryApplication } from '../../../../domain/interfaces/repositories/application.repository.interface';
import { APPLICATION_REPOSITORY } from '../../../../domain/interfaces/repositories/application.repository.interface';
import { UuidSchema } from '../../../../../shared/constants/validation';

@Injectable()
@QueryHandler(GetUserApplicationsQuery)
export class GetUserApplicationsQueryHandler extends BaseQueryHandler<
  GetUserApplicationsQuery,
  Application[]
> {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: IRepositoryApplication,
  ) {
    super();
  }

  async query(query: GetUserApplicationsQuery): Promise<Application[]> {
    UuidSchema.parse(query.userId);

    return await this.applicationRepository.findByStudent(query.userId);
  }
}
