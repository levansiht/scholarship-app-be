import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginQuery } from './login.query';
import { BaseQueryHandler } from '../../common';
import { UserRepository } from '../../../../infras/repositories';

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    status: string;
  };
}

@Injectable()
@QueryHandler(LoginQuery)
export class LoginQueryHandler
  extends BaseQueryHandler<LoginQuery, LoginResponse>
  implements IQueryHandler<LoginQuery>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async query(query: LoginQuery): Promise<LoginResponse> {
    const { email, password } = query.data;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password.value);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive()) {
      throw new UnauthorizedException('User account is not active');
    }

    const payload = {
      sub: user.id,
      email: user.email.value,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email.value,
        role: user.role,
        status: user.status,
      },
    };
  }
}
