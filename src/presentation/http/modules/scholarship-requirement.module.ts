import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ScholarshipRequirementController } from '../controllers/scholarship-requirement.controller';
import { RepositoriesModule } from '../../../infras/repositories';

import {
  AddRequirementCommandHandler,
  UpdateRequirementCommandHandler,
  DeleteRequirementCommandHandler,
} from '../../../core/application/commands/scholarship-requirement';

import { GetRequirementsQueryHandler } from '../../../core/application/queries/scholarship-requirement';

const CommandHandlers = [
  AddRequirementCommandHandler,
  UpdateRequirementCommandHandler,
  DeleteRequirementCommandHandler,
];

const QueryHandlers = [GetRequirementsQueryHandler];

@Module({
  imports: [CqrsModule, RepositoriesModule],
  controllers: [ScholarshipRequirementController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class ScholarshipRequirementModule {}
