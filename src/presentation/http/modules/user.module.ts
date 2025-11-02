import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from '../controllers/user.controller';
import { RepositoriesModule } from '../../../infras/repositories/repositories.module';

// Command Handlers
import { CreateUserCommandHandler } from '../../../core/application/commands/user/create-user.handler';
import { UpdateUserCommandHandler } from '../../../core/application/commands/user/update-user.handler';
import { ChangePasswordCommandHandler } from '../../../core/application/commands/user/change-password.handler';
import { SuspendUserCommandHandler } from '../../../core/application/commands/user/suspend-user.handler';
import { ActivateUserCommandHandler } from '../../../core/application/commands/user/activate-user.handler';

// Query Handlers
import { GetUserByIdQueryHandler } from '../../../core/application/queries/user/get-user-by-id/get-user-by-id.handler';
import { GetUserByEmailQueryHandler } from '../../../core/application/queries/user/get-user-by-email/get-user-by-email.handler';
import { ListUsersQueryHandler } from '../../../core/application/queries/user/list-users/list-users.handler';

const CommandHandlers = [
  CreateUserCommandHandler,
  UpdateUserCommandHandler,
  ChangePasswordCommandHandler,
  SuspendUserCommandHandler,
  ActivateUserCommandHandler,
];

const QueryHandlers = [
  GetUserByIdQueryHandler,
  GetUserByEmailQueryHandler,
  ListUsersQueryHandler,
];

@Module({
  imports: [CqrsModule, RepositoriesModule],
  controllers: [UserController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class UserModule {}
