import { Injectable, Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { BaseQueryHandler } from '../../../common/base.query-handler';
import { ListScholarshipsQuery } from './list-scholarships.query';
import { SCHOLARSHIP_REPOSITORY } from '../../../../domain/interfaces/repositories';
import type { IRepositoryScholarship } from '../../../../domain/interfaces/repositories';
import { Scholarship } from '../../../../domain/entities';
import type { PaginatedResult } from '../../../../domain/interfaces/repositories';

@Injectable()
@QueryHandler(ListScholarshipsQuery)
export class ListScholarshipsQueryHandler extends BaseQueryHandler<
  ListScholarshipsQuery,
  PaginatedResult<Scholarship>
> {
  constructor(
    @Inject(SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: IRepositoryScholarship,
  ) {
    super();
  }

  async query(
    query: ListScholarshipsQuery,
  ): Promise<PaginatedResult<Scholarship>> {
    const result = await this.scholarshipRepository.findAll({
      page: query.page,
      limit: query.limit,
    });

    return result;
  }
}
