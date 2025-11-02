import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import { JwtAuthGuard, RolesGuard, Roles } from '../../../infras/auth';
import { UserRole } from '../../../shared/constants';
import {
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
  UpdateUserHttpDto,
  ChangePasswordHttpDto,
  SuspendUserHttpDto,
} from '../dtos';

@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  async getUserById(@Param('id') id: string): Promise<User> {
    const query = new GetUserByIdQuery(id);
    return await this.queryBus.execute(query);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: '[Admin Only] List users with pagination' })
  @ApiResponse({ status: 200, description: 'Users list' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
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
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: '[Admin Only] Update user (can change role)' })
  @ApiBody({ type: UpdateUserHttpDto })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
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
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: '[Admin Only] Suspend user' })
  @ApiBody({ type: SuspendUserHttpDto })
  @ApiResponse({ status: 200, description: 'User suspended' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
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
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: '[Admin Only] Activate user' })
  @ApiResponse({ status: 200, description: 'User activated' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async activateUser(@Param('id') id: string): Promise<User> {
    const command = new ActivateUserCommand({ userId: id });
    return await this.commandBus.execute(command);
  }
}
