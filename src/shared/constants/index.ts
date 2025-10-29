/**
 * @file Shared Constants - Barrel Export
 * @description Single source of truth for enums, validation schemas, and messages
 * Import from this file across ALL layers to ensure consistency
 */

// TypeScript Enums
export {
  UserRole,
  UserStatus,
  ScholarshipStatus,
  ApplicationStatus,
  Currency,
} from './enums';

// Zod Validation Schemas
export {
  UserRoleEnum,
  UserStatusEnum,
  CurrencyEnum,
  ScholarshipStatusEnum,
  ApplicationStatusEnum,
  UuidSchema,
} from './validation';

// Error & Success Messages
export {
  USER_ERRORS,
  SCHOLARSHIP_ERRORS,
  APPLICATION_ERRORS,
  VALIDATION_ERRORS,
  SUCCESS_MESSAGES,
} from './messages';
