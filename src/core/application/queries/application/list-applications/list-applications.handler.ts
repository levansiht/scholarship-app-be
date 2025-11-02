import { Inject, Injectable } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { BaseQueryHandler } from '../../../common/base.query-handler';
import { ListApplicationsQuery } from './list-applications.query';
import { Application } from '../../../../domain/entities/application.entity';
import type { IRepositoryApplication } from '../../../../domain/interfaces/repositories/application.repository.interface';
import { APPLICATION_REPOSITORY } from '../../../../domain/interfaces/repositories/application.repository.interface';
import type { PaginatedResult } from '../../../../domain/interfaces/repositories/base.repository.interface';

@Injectable()
@QueryHandler(ListApplicationsQuery)
export class ListApplicationsQueryHandler extends BaseQueryHandler<
  ListApplicationsQuery,
  PaginatedResult<Application>
> {
  constructor(
    @Inject(APPLICATION_REPOSITORY)
    private readonly applicationRepository: IRepositoryApplication,
  ) {
    super();
  }

  async query(
    query: ListApplicationsQuery,
  ): Promise<PaginatedResult<Application>> {
    return await this.applicationRepository.findAll({
      page: query.page || 1,
      limit: query.limit || 10,
    });
  }
}
