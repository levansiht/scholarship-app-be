import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RepositoriesModule } from '../../../infras/repositories/repositories.module';
import { SupabaseModule } from '../../../infras/storage/supabase/supabase.module';
import { ApplicationController } from '../controllers/application.controller';

import { SubmitApplicationCommandHandler } from '../../../core/application/commands/application/submit-application/submit-application.handler';
import { ApproveApplicationCommandHandler } from '../../../core/application/commands/application/approve-application/approve-application.handler';
import { RejectApplicationCommandHandler } from '../../../core/application/commands/application/reject-application/reject-application.handler';
import { WithdrawApplicationCommandHandler } from '../../../core/application/commands/application/withdraw-application/withdraw-application.handler';
import { UploadApplicationDocumentsHandler } from '../../../core/application/commands/application/upload-documents/upload-documents.handler';

import { GetApplicationByIdQueryHandler } from '../../../core/application/queries/application/get-application-by-id/get-application-by-id.handler';
import { ListApplicationsQueryHandler } from '../../../core/application/queries/application/list-applications/list-applications.handler';
import { GetUserApplicationsQueryHandler } from '../../../core/application/queries/application/get-user-applications/get-user-applications.handler';

const CommandHandlers = [
  SubmitApplicationCommandHandler,
  ApproveApplicationCommandHandler,
  RejectApplicationCommandHandler,
  WithdrawApplicationCommandHandler,
  UploadApplicationDocumentsHandler,
];

const QueryHandlers = [
  GetApplicationByIdQueryHandler,
  ListApplicationsQueryHandler,
  GetUserApplicationsQueryHandler,
];

@Module({
  imports: [CqrsModule, RepositoriesModule, SupabaseModule],
  controllers: [ApplicationController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class ApplicationModule {}
