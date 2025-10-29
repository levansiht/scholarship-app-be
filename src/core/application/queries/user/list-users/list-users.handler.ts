import { Injectable, Inject } from '@nestjs/common';
import { BaseQueryHandler } from '../../../common/base.query-handler';
import { ListUsersQuery } from './list-users.query';
import { USER_REPOSITORY } from '../../../../domain/interfaces/repositories';
import type { IRepositoryUser } from '../../../../domain/interfaces/repositories';
import { User } from '../../../../domain/entities';

export interface ListUsersResult {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ListUsersQueryHandler extends BaseQueryHandler<
  ListUsersQuery,
  ListUsersResult
> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IRepositoryUser,
  ) {
    super();
  }

  async query(query: ListUsersQuery): Promise<ListUsersResult> {
    const result = await this.userRepository.findAll({
      page: query.page,
      limit: query.limit,
    });

    return result;
  }
}
