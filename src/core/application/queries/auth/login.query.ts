import { BaseQuery } from '../../common';
import { LoginDto } from '../../../domain/dtos/login.dto.schema';

export class LoginQuery extends BaseQuery {
  constructor(public readonly data: LoginDto) {
    super();
  }
}
