import { Injectable, Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '../../../common';
import { RemoveCategoryCommand } from './remove-category.command';
import {
  IScholarshipCategoryRepository,
  SCHOLARSHIP_CATEGORY_REPOSITORY,
} from '../../../../domain/interfaces/repositories';

@Injectable()
@CommandHandler(RemoveCategoryCommand)
export class RemoveCategoryCommandHandler extends BaseCommandHandler<
  RemoveCategoryCommand,
  void
> {
  constructor(
    @Inject(SCHOLARSHIP_CATEGORY_REPOSITORY)
    private readonly categoryRepository: IScholarshipCategoryRepository,
  ) {
    super();
  }

  async execute(command: RemoveCategoryCommand): Promise<void> {
    const { scholarshipId, categoryId } = command;

    // Delete category (no error if not found)
    await this.categoryRepository.delete(scholarshipId, categoryId);
  }
}
