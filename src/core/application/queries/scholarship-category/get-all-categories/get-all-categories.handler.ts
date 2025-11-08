import { Injectable, Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { BaseQueryHandler } from '../../../common';
import { GetAllCategoriesQuery } from './get-all-categories.query';
import {
  IScholarshipCategoryRepository,
  SCHOLARSHIP_CATEGORY_REPOSITORY,
} from '../../../../domain/interfaces/repositories';

@Injectable()
@QueryHandler(GetAllCategoriesQuery)
export class GetAllCategoriesQueryHandler extends BaseQueryHandler<
  GetAllCategoriesQuery,
  string[]
> {
  constructor(
    @Inject(SCHOLARSHIP_CATEGORY_REPOSITORY)
    private readonly categoryRepository: IScholarshipCategoryRepository,
  ) {
    super();
  }

  async query(_query: GetAllCategoriesQuery): Promise<string[]> {
    void _query;
    return await this.categoryRepository.findAll();
  }
}
