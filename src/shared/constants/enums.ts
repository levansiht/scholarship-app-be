/**
 * @file Shared Enums - Single Source of Truth
 * @description TypeScript enums used across ALL layers (domain, application, infrastructure)
 * These enums MUST match Prisma schema enums exactly
 */

/**
 * User role enumeration
 * Defines access control levels in the system
 */
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  SPONSOR = 'SPONSOR',
}

/**
 * User account status
 * Tracks lifecycle state of user accounts
 */
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

/**
 * Scholarship publication status
 * Tracks the lifecycle of scholarship offerings
 */
export enum ScholarshipStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
}

/**
 * Application workflow status
 * Tracks student application through review process
 */
export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  AWARDED = 'AWARDED',
  WITHDRAWN = 'WITHDRAWN',
  CANCELLED = 'CANCELLED',
}

/**
 * Currency codes for monetary values
 * Supports multi-currency scholarship amounts
 */
export enum Currency {
  VND = 'VND',
  USD = 'USD',
}
