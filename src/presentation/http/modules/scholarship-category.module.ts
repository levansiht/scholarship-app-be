import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ScholarshipCategoryController } from '../controllers/scholarship-category.controller';
import { RepositoriesModule } from '../../../infras/repositories';
import {
  AddCategoryCommandHandler,
  RemoveCategoryCommandHandler,
} from '../../../core/application/commands/scholarship-category';
import { GetAllCategoriesQueryHandler } from '../../../core/application/queries/scholarship-category';

const CommandHandlers = [
  AddCategoryCommandHandler,
  RemoveCategoryCommandHandler,
];

const QueryHandlers = [GetAllCategoriesQueryHandler];

@Module({
  imports: [CqrsModule, RepositoriesModule],
  controllers: [ScholarshipCategoryController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class ScholarshipCategoryModule {}
