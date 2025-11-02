import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { BaseQueryHandler } from '../../../common/base.query-handler';
import { GetUserByEmailQuery } from './get-user-by-email.query';
import { USER_REPOSITORY } from '../../../../domain/interfaces/repositories';
import type { IRepositoryUser } from '../../../../domain/interfaces/repositories';
import { User } from '../../../../domain/entities';
import { EmailSchema } from '../../../../domain/schemas';
import { USER_ERRORS } from '../../../../../shared/constants';

@Injectable()
@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailQueryHandler extends BaseQueryHandler<
  GetUserByEmailQuery,
  User
> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IRepositoryUser,
  ) {
    super();
  }

  async query(query: GetUserByEmailQuery): Promise<User> {
    this.validateWithSchema(query.email, EmailSchema);

    const user = await this.userRepository.findByEmail(query.email);

    if (!user) {
      throw new NotFoundException(USER_ERRORS.EMAIL_NOT_FOUND(query.email));
    }

    return user;
  }
}
