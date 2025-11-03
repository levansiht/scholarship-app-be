// Re-export entities and their types
export { User, type UserProps } from './user.entity';
export { Scholarship, type ScholarshipProps } from './scholarship.entity';
export { Application, type ApplicationProps } from './application.entity';
export { SavedScholarship } from './saved-scholarship.entity';

// Re-export enums from shared constants for backward compatibility
export {
  UserRole,
  UserStatus,
  ScholarshipStatus,
  ApplicationStatus,
} from '../../../shared/constants';
