import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserRepository } from './user.repository';
import { ScholarshipRepository } from './scholarship.repository';
import { ApplicationRepository } from './application.repository';
import { SavedScholarshipRepository } from './saved-scholarship.repository';
import { ScholarshipCategoryRepository } from './scholarship-category.repository';
import { ProfileRepository } from './profile.repository';
import { ScholarshipDocumentRepository } from './scholarship-document.repository';
import {
  USER_REPOSITORY,
  SCHOLARSHIP_REPOSITORY,
  APPLICATION_REPOSITORY,
  SAVED_SCHOLARSHIP_REPOSITORY,
  SCHOLARSHIP_CATEGORY_REPOSITORY,
  PROFILE_REPOSITORY,
  SCHOLARSHIP_DOCUMENT_REPOSITORY,
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
    ScholarshipDocumentRepository,
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
    {
      provide: SCHOLARSHIP_DOCUMENT_REPOSITORY,
      useClass: ScholarshipDocumentRepository,
    },
  ],
  exports: [
    UserRepository,
    ScholarshipRepository,
    ApplicationRepository,
    SavedScholarshipRepository,
    ScholarshipCategoryRepository,
    ProfileRepository,
    ScholarshipDocumentRepository,
    USER_REPOSITORY,
    SCHOLARSHIP_REPOSITORY,
    APPLICATION_REPOSITORY,
    SAVED_SCHOLARSHIP_REPOSITORY,
    SCHOLARSHIP_CATEGORY_REPOSITORY,
    PROFILE_REPOSITORY,
    SCHOLARSHIP_DOCUMENT_REPOSITORY,
  ],
})
export class RepositoriesModule {}
