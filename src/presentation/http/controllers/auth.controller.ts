import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RegisterHttpDto } from '../dtos/register-http.dto';
import { LoginHttpDto } from '../dtos/login-http.dto';
import { RegisterCommand } from '../../../core/application/commands/auth/register.command';
import { LoginQuery } from '../../../core/application/queries/auth/login.query';
import { RegisterDtoSchema, LoginDtoSchema } from '../../../core/domain/dtos';
import { User } from '../../../core/domain/entities';
import { LoginResponse } from '../../../core/application/queries/auth/login.query-handler';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'student@example.com',
        role: 'STUDENT',
        status: 'ACTIVE',
        createdAt: '2025-10-29T10:00:00.000Z',
        updatedAt: '2025-10-29T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or email already exists',
  })
  async register(@Body() dto: RegisterHttpDto) {
    const validated = RegisterDtoSchema.parse(dto);

    const command = new RegisterCommand(validated);
    const user = await this.commandBus.execute<RegisterCommand, User>(command);

    return {
      id: user.id,
      email: user.email.value,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'student@example.com',
          role: 'STUDENT',
          status: 'ACTIVE',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginHttpDto) {
    const validated = LoginDtoSchema.parse(dto);

    const query = new LoginQuery(validated);
    return await this.queryBus.execute<LoginQuery, LoginResponse>(query);
  }
}
