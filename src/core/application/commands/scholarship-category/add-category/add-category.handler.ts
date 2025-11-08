import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '../../../common';
import { AddCategoryCommand } from './add-category.command';
import { ScholarshipCategory } from '../../../../domain/entities';
import {
  IScholarshipCategoryRepository,
  SCHOLARSHIP_CATEGORY_REPOSITORY,
  IRepositoryScholarship,
  SCHOLARSHIP_REPOSITORY,
} from '../../../../domain/interfaces/repositories';

@Injectable()
@CommandHandler(AddCategoryCommand)
export class AddCategoryCommandHandler extends BaseCommandHandler<
  AddCategoryCommand,
  ScholarshipCategory
> {
  constructor(
    @Inject(SCHOLARSHIP_CATEGORY_REPOSITORY)
    private readonly categoryRepository: IScholarshipCategoryRepository,
    @Inject(SCHOLARSHIP_REPOSITORY)
    private readonly scholarshipRepository: IRepositoryScholarship,
  ) {
    super();
  }

  async execute(command: AddCategoryCommand): Promise<ScholarshipCategory> {
    const { scholarshipId, name } = command;

    // 1. Check scholarship exists
    const scholarship =
      await this.scholarshipRepository.findById(scholarshipId);
    if (!scholarship) {
      throw new NotFoundException('Scholarship not found');
    }

    // 2. Check if category already exists for this scholarship
    const exists = await this.categoryRepository.exists(scholarshipId, name);
    if (exists) {
      throw new ConflictException(
        `Category "${name}" already exists for this scholarship`,
      );
    }

    // 3. Add category
    return await this.categoryRepository.create(scholarshipId, name);
  }
}
