import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RepositoriesModule } from '../../../infras/repositories/repositories.module';
import { ScholarshipController } from '../controllers/scholarship.controller';

// Command Handlers
import { CreateScholarshipCommandHandler } from '../../../core/application/commands/scholarship/create-scholarship/create-scholarship.handler';
import { UpdateScholarshipCommandHandler } from '../../../core/application/commands/scholarship/update-scholarship/update-scholarship.handler';
import { PublishScholarshipCommandHandler } from '../../../core/application/commands/scholarship/publish-scholarship/publish-scholarship.handler';
import { CloseScholarshipCommandHandler } from '../../../core/application/commands/scholarship/close-scholarship/close-scholarship.handler';

// Query Handlers
import { GetScholarshipByIdQueryHandler } from '../../../core/application/queries/scholarship/get-scholarship-by-id/get-scholarship-by-id.handler';
import { ListScholarshipsQueryHandler } from '../../../core/application/queries/scholarship/list-scholarships/list-scholarships.handler';
import { SearchScholarshipsQueryHandler } from '../../../core/application/queries/scholarship/search-scholarships/search-scholarships.handler';

const CommandHandlers = [
  CreateScholarshipCommandHandler,
  UpdateScholarshipCommandHandler,
  PublishScholarshipCommandHandler,
  CloseScholarshipCommandHandler,
];

const QueryHandlers = [
  GetScholarshipByIdQueryHandler,
  ListScholarshipsQueryHandler,
  SearchScholarshipsQueryHandler,
];

@Module({
  imports: [CqrsModule, RepositoriesModule],
  controllers: [ScholarshipController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class ScholarshipModule {}
