import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../infras/auth/jwt-auth.guard';
import {
  CreateUserCommand,
  UpdateUserCommand,
  ChangePasswordCommand,
  SuspendUserCommand,
  ActivateUserCommand,
} from '../../../core/application/commands/user';
import {
  GetUserByIdQuery,
  ListUsersQuery,
} from '../../../core/application/queries/user';
import type { User } from '../../../core/domain/entities';
import {
  CreateUserHttpDto,
  UpdateUserHttpDto,
  ChangePasswordHttpDto,
  SuspendUserHttpDto,
} from '../dtos';
import { UserRole } from '../../../shared/constants';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user (role: STUDENT by default)' })
  @ApiBody({ type: CreateUserHttpDto })
  @ApiResponse({ status: 201, description: 'User created' })
  async createUser(@Body() dto: CreateUserHttpDto): Promise<User> {
    const command = new CreateUserCommand({
      email: dto.email,
      password: dto.password,
      role: UserRole.STUDENT, // Always STUDENT on registration
    });
    return await this.commandBus.execute(command);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  async getUserById(@Param('id') id: string): Promise<User> {
    const query = new GetUserByIdQuery(id);
    return await this.queryBus.execute(query);
  }

  @Get()
  @ApiOperation({ summary: 'List users with pagination' })
  @ApiResponse({ status: 200, description: 'Users list' })
  async listUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{ users: User[]; total: number; page: number; limit: number }> {
    const query = new ListUsersQuery({
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
    return await this.queryBus.execute(query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user (admin only - can change role)' })
  @ApiBody({ type: UpdateUserHttpDto })
  @ApiResponse({ status: 200, description: 'User updated' })
  async updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserHttpDto,
  ): Promise<User> {
    const command = new UpdateUserCommand({
      userId: id,
      ...dto,
    });
    return await this.commandBus.execute(command);
  }

  @Patch(':id/password')
  @ApiOperation({ summary: 'Change password' })
  @ApiBody({ type: ChangePasswordHttpDto })
  @ApiResponse({ status: 200, description: 'Password changed' })
  async changePassword(
    @Param('id') id: string,
    @Body() dto: ChangePasswordHttpDto,
  ): Promise<User> {
    const command = new ChangePasswordCommand({
      userId: id,
      oldPassword: dto.currentPassword,
      newPassword: dto.newPassword,
    });
    return await this.commandBus.execute(command);
  }

  @Patch(':id/suspend')
  @ApiOperation({ summary: 'Suspend user (admin only)' })
  @ApiBody({ type: SuspendUserHttpDto })
  @ApiResponse({ status: 200, description: 'User suspended' })
  async suspendUser(
    @Param('id') id: string,
    @Body() dto: SuspendUserHttpDto,
  ): Promise<User> {
    const command = new SuspendUserCommand({
      userId: id,
      reason: dto.reason || 'Suspended by admin',
    });
    return await this.commandBus.execute(command);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate user (admin only)' })
  @ApiResponse({ status: 200, description: 'User activated' })
  async activateUser(@Param('id') id: string): Promise<User> {
    const command = new ActivateUserCommand({ userId: id });
    return await this.commandBus.execute(command);
  }
}
