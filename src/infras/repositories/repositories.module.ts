import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserRepository } from './user.repository';
import { ScholarshipRepository } from './scholarship.repository';
import { ApplicationRepository } from './application.repository';
import { SavedScholarshipRepository } from './saved-scholarship.repository';
import { ScholarshipCategoryRepository } from './scholarship-category.repository';
import { ProfileRepository } from './profile.repository';
import { ScholarshipDocumentRepository } from './scholarship-document.repository';
import { ScholarshipRequirementRepository } from './scholarship-requirement.repository';
import { SponsorProfileRepository } from './sponsor-profile.repository';
import { StudentProfileRepository } from './student-profile.repository';
import { EligibilityCriteriaRepository } from './eligibility-criteria.repository';
import {
  USER_REPOSITORY,
  SCHOLARSHIP_REPOSITORY,
  APPLICATION_REPOSITORY,
  SAVED_SCHOLARSHIP_REPOSITORY,
  SCHOLARSHIP_CATEGORY_REPOSITORY,
  PROFILE_REPOSITORY,
  SCHOLARSHIP_DOCUMENT_REPOSITORY,
  SCHOLARSHIP_REQUIREMENT_REPOSITORY,
  SPONSOR_PROFILE_REPOSITORY,
  STUDENT_PROFILE_REPOSITORY,
  ELIGIBILITY_CRITERIA_REPOSITORY,
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
    ScholarshipRequirementRepository,
    SponsorProfileRepository,
    StudentProfileRepository,
    EligibilityCriteriaRepository,
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
    {
      provide: SCHOLARSHIP_REQUIREMENT_REPOSITORY,
      useClass: ScholarshipRequirementRepository,
    },
    {
      provide: SPONSOR_PROFILE_REPOSITORY,
      useClass: SponsorProfileRepository,
    },
    {
      provide: STUDENT_PROFILE_REPOSITORY,
      useClass: StudentProfileRepository,
    },
    {
      provide: ELIGIBILITY_CRITERIA_REPOSITORY,
      useClass: EligibilityCriteriaRepository,
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
    ScholarshipRequirementRepository,
    SponsorProfileRepository,
    StudentProfileRepository,
    EligibilityCriteriaRepository,
    USER_REPOSITORY,
    SCHOLARSHIP_REPOSITORY,
    APPLICATION_REPOSITORY,
    SAVED_SCHOLARSHIP_REPOSITORY,
    SCHOLARSHIP_CATEGORY_REPOSITORY,
    PROFILE_REPOSITORY,
    SCHOLARSHIP_DOCUMENT_REPOSITORY,
    SCHOLARSHIP_REQUIREMENT_REPOSITORY,
    SPONSOR_PROFILE_REPOSITORY,
    STUDENT_PROFILE_REPOSITORY,
    ELIGIBILITY_CRITERIA_REPOSITORY,
  ],
})
export class RepositoriesModule {}
