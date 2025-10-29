/**
 * @file DTO Validation Constants
 * @description Re-exports Zod validation schemas from shared constants
 * Maintains backward compatibility for existing DTO imports
 */

// Re-export all Zod validation schemas from shared constants
export {
  UserRoleEnum,
  UserStatusEnum,
  CurrencyEnum as ScholarshipCurrencyEnum,
  ScholarshipStatusEnum,
  ApplicationStatusEnum,
  UuidSchema,
} from '../../../shared/constants';
