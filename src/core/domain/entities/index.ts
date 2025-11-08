// Re-export entities and their types
export { User, type UserProps } from './user.entity';
export { Scholarship, type ScholarshipProps } from './scholarship.entity';
export { Application, type ApplicationProps } from './application.entity';
export { SavedScholarship } from './saved-scholarship.entity';
export { ScholarshipCategory } from './scholarship-category.entity';
export { Profile, type ProfileProps } from './profile.entity';
export {
  ScholarshipDocument,
  type ScholarshipDocumentProps,
} from './scholarship-document.entity';
export {
  ScholarshipRequirement,
  type ScholarshipRequirementProps,
} from './scholarship-requirement.entity';
export {
  SponsorProfile,
  type SponsorProfileProps,
} from './sponsor-profile.entity';
export {
  StudentProfile,
  type StudentProfileProps,
} from './student-profile.entity';
export {
  EligibilityCriteria,
  type EligibilityCriteriaProps,
} from './eligibility-criteria.entity';

// Re-export enums from shared constants for backward compatibility
export {
  UserRole,
  UserStatus,
  ScholarshipStatus,
  ApplicationStatus,
} from '../../../shared/constants';
