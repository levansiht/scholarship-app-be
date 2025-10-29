import { Inject, Injectable } from '@nestjs/common';
import { BaseQueryHandler } from '../../../common/base.query-handler';
import { SearchScholarshipsQuery } from './search-scholarships.query';
import { Scholarship } from '../../../../domain/entities/scholarship.entity';
import type { IRepositoryScholarship } from '../../../../domain/interfaces/repositories/scholarship.repository.interface';
import { SCHOLARSHIP_REPOSITORY } from '../../../../domain/interfaces/repositories/scholarship.repository.interface';

@Injectable()
export class SearchScholarshipsQueryHandler extends BaseQueryHandler<
  SearchScholarshipsQuery,
  Scholarship[]
> {
  constructor(
    @Inject(SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: IRepositoryScholarship,
  ) {
    super();
  }

  async query(query: SearchScholarshipsQuery): Promise<Scholarship[]> {
    return await this.scholarshipRepository.search(query.keyword);
  }
}
