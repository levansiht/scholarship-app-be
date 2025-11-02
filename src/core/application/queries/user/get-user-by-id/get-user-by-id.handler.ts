import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { BaseQueryHandler } from '../../../common/base.query-handler';
import { GetUserByIdQuery } from './get-user-by-id.query';
import { USER_REPOSITORY } from '../../../../domain/interfaces/repositories';
import type { IRepositoryUser } from '../../../../domain/interfaces/repositories';
import { User } from '../../../../domain/entities';
import { UuidSchema, USER_ERRORS } from '../../../../../shared/constants';

@Injectable()
@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler extends BaseQueryHandler<
  GetUserByIdQuery,
  User
> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IRepositoryUser,
  ) {
    super();
  }

  async query(query: GetUserByIdQuery): Promise<User> {
    this.validateWithSchema(query.userId, UuidSchema);

    const user = await this.userRepository.findById(query.userId);

    if (!user) {
      throw new NotFoundException(USER_ERRORS.NOT_FOUND(query.userId));
    }

    return user;
  }
}
