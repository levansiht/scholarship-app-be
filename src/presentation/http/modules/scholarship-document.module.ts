import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ScholarshipDocumentController } from '../controllers/scholarship-document.controller';
import { RepositoriesModule } from '../../../infras/repositories';
import { SupabaseModule } from '../../../infras/storage/supabase/supabase.module';

// Import Command Handlers
import {
  UploadDocumentCommandHandler,
  DeleteDocumentCommandHandler,
} from '../../../core/application/commands/scholarship-document';

// Import Query Handlers
import {
  GetDocumentsQueryHandler,
  GetDocumentQueryHandler,
} from '../../../core/application/queries/scholarship-document';

const CommandHandlers = [
  UploadDocumentCommandHandler,
  DeleteDocumentCommandHandler,
];

const QueryHandlers = [GetDocumentsQueryHandler, GetDocumentQueryHandler];

@Module({
  imports: [CqrsModule, RepositoriesModule, SupabaseModule],
  controllers: [ScholarshipDocumentController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class ScholarshipDocumentModule {}
