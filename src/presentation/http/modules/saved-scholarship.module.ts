import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SavedScholarshipController } from '../controllers/saved-scholarship.controller';
import { RepositoriesModule } from '../../../infras/repositories';

// Import Command Handlers
import {
  SaveScholarshipCommandHandler,
  UnsaveScholarshipCommandHandler,
} from '../../../core/application/commands/saved-scholarship';

// Import Query Handlers
import {
  GetSavedScholarshipsQueryHandler,
  CheckScholarshipSavedQueryHandler,
} from '../../../core/application/queries/saved-scholarship';

const CommandHandlers = [
  SaveScholarshipCommandHandler,
  UnsaveScholarshipCommandHandler,
];

const QueryHandlers = [
  GetSavedScholarshipsQueryHandler,
  CheckScholarshipSavedQueryHandler,
];

@Module({
  imports: [CqrsModule, RepositoriesModule],
  controllers: [SavedScholarshipController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class SavedScholarshipModule {}
