import { Module } from '@nestjs/common';
import { RepositoriesModule } from '../../../../infras/repositories/repositories.module';
import {
  CreateUserCommandHandler,
  UpdateUserCommandHandler,
  ActivateUserCommandHandler,
  SuspendUserCommandHandler,
  ChangePasswordCommandHandler,
} from './index';

@Module({
  imports: [RepositoriesModule],
  providers: [
    CreateUserCommandHandler,
    UpdateUserCommandHandler,
    ActivateUserCommandHandler,
    SuspendUserCommandHandler,
    ChangePasswordCommandHandler,
  ],
  exports: [
    CreateUserCommandHandler,
    UpdateUserCommandHandler,
    ActivateUserCommandHandler,
    SuspendUserCommandHandler,
    ChangePasswordCommandHandler,
  ],
})
export class UserCommandsModule {}
