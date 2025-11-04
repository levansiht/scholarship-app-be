import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserRepository } from './user.repository';
import { ScholarshipRepository } from './scholarship.repository';
import { ApplicationRepository } from './application.repository';
import { SavedScholarshipRepository } from './saved-scholarship.repository';
import { ScholarshipCategoryRepository } from './scholarship-category.repository';
import { ProfileRepository } from './profile.repository';
import {
  USER_REPOSITORY,
  SCHOLARSHIP_REPOSITORY,
  APPLICATION_REPOSITORY,
  SAVED_SCHOLARSHIP_REPOSITORY,
  SCHOLARSHIP_CATEGORY_REPOSITORY,
  PROFILE_REPOSITORY,
} from '../../core/domain/interfaces/repositories';

@Module({
  imports: [DatabaseModule],
  providers: [
    UserRepository,
    ScholarshipRepository,
    ApplicationRepository,
    SavedScholarshipRepository,
    ScholarshipCategoryRepository,
    ProfileRepository,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: SCHOLARSHIP_REPOSITORY,
      useClass: ScholarshipRepository,
    },
    {
      provide: APPLICATION_REPOSITORY,
      useClass: ApplicationRepository,
    },
    {
      provide: SAVED_SCHOLARSHIP_REPOSITORY,
      useClass: SavedScholarshipRepository,
    },
    {
      provide: SCHOLARSHIP_CATEGORY_REPOSITORY,
      useClass: ScholarshipCategoryRepository,
    },
    {
      provide: PROFILE_REPOSITORY,
      useClass: ProfileRepository,
    },
  ],
  exports: [
    UserRepository,
    ScholarshipRepository,
    ApplicationRepository,
    SavedScholarshipRepository,
    ScholarshipCategoryRepository,
    ProfileRepository,
    USER_REPOSITORY,
    SCHOLARSHIP_REPOSITORY,
    APPLICATION_REPOSITORY,
    SAVED_SCHOLARSHIP_REPOSITORY,
    SCHOLARSHIP_CATEGORY_REPOSITORY,
    PROFILE_REPOSITORY,
  ],
})
export class RepositoriesModule {}
