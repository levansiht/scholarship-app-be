import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RepositoriesModule } from '../../../infras/repositories/repositories.module';
import { ApplicationController } from '../controllers/application.controller';

// Command Handlers
import { SubmitApplicationCommandHandler } from '../../../core/application/commands/application/submit-application/submit-application.handler';
import { ApproveApplicationCommandHandler } from '../../../core/application/commands/application/approve-application/approve-application.handler';
import { RejectApplicationCommandHandler } from '../../../core/application/commands/application/reject-application/reject-application.handler';
import { WithdrawApplicationCommandHandler } from '../../../core/application/commands/application/withdraw-application/withdraw-application.handler';

// Query Handlers
import { GetApplicationByIdQueryHandler } from '../../../core/application/queries/application/get-application-by-id/get-application-by-id.handler';
import { ListApplicationsQueryHandler } from '../../../core/application/queries/application/list-applications/list-applications.handler';
import { GetUserApplicationsQueryHandler } from '../../../core/application/queries/application/get-user-applications/get-user-applications.handler';

const CommandHandlers = [
  SubmitApplicationCommandHandler,
  ApproveApplicationCommandHandler,
  RejectApplicationCommandHandler,
  WithdrawApplicationCommandHandler,
];

const QueryHandlers = [
  GetApplicationByIdQueryHandler,
  ListApplicationsQueryHandler,
  GetUserApplicationsQueryHandler,
];

@Module({
  imports: [CqrsModule, RepositoriesModule],
  controllers: [ApplicationController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class ApplicationModule {}
