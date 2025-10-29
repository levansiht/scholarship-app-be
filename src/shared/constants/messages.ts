export const USER_ERRORS = {
  NOT_FOUND: (userId: string) => `User with id ${userId} not found`,
  EMAIL_EXISTS: (email: string) => `User with email ${email} already exists`,
  EMAIL_NOT_FOUND: (email: string) => `User with email ${email} not found`,
  ALREADY_ACTIVE: 'User is already active',
  ALREADY_SUSPENDED: 'User is already suspended',
  ALREADY_INACTIVE: 'User is already inactive',
  OLD_PASSWORD_INCORRECT: 'Old password is incorrect',
  PASSWORD_MUST_DIFFER: 'New password must be different from old password',
  CANNOT_SUSPEND_SELF: 'Cannot suspend your own account',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions for this operation',
} as const;

export const SCHOLARSHIP_ERRORS = {
  NOT_FOUND: (scholarshipId: string) =>
    `Scholarship with id ${scholarshipId} not found`,
  SLUG_EXISTS: (slug: string) =>
    `Scholarship with slug '${slug}' already exists`,
  ALREADY_PUBLISHED: 'Scholarship is already published',
  ALREADY_CLOSED: 'Scholarship is already closed',
  ALREADY_SUSPENDED: 'Scholarship is already suspended',
  ALREADY_EXPIRED: 'Scholarship has already expired',
  NO_SLOTS_AVAILABLE: 'No available slots for this scholarship',
  DEADLINE_PASSED: 'Application deadline has passed',
  NOT_OPEN: 'Scholarship is not open for applications',
  INVALID_DATE_RANGE: 'Start date must be before end date',
  INVALID_DEADLINE: 'Deadline must be before or equal to end date',
  CANNOT_MODIFY_PUBLISHED: 'Cannot modify published scholarship',
} as const;

export const APPLICATION_ERRORS = {
  NOT_FOUND: (applicationId: string) =>
    `Application with id ${applicationId} not found`,
  ALREADY_SUBMITTED: 'Application has already been submitted',
  ALREADY_APPROVED: 'Application has already been approved',
  ALREADY_REJECTED: 'Application has already been rejected',
  ALREADY_WITHDRAWN: 'Application has already been withdrawn',
  SCHOLARSHIP_CLOSED: 'Cannot apply to closed scholarship',
  NO_SLOTS: 'No available slots for this scholarship',
  DUPLICATE_APPLICATION: 'User has already applied for this scholarship',
  CANNOT_MODIFY_SUBMITTED: 'Cannot modify submitted application',
  INVALID_STATUS_TRANSITION: (from: string, to: string) =>
    `Invalid status transition from ${from} to ${to}`,
} as const;

export const VALIDATION_ERRORS = {
  INVALID_UUID: (field: string) => `${field} must be a valid UUID`,
  REQUIRED_FIELD: (field: string) => `${field} is required`,
  MIN_LENGTH: (field: string, min: number) =>
    `${field} must be at least ${min} characters`,
  MAX_LENGTH: (field: string, max: number) =>
    `${field} must not exceed ${max} characters`,
  INVALID_EMAIL: 'Invalid email format',
  INVALID_DATE: 'Invalid date format',
  POSITIVE_NUMBER: (field: string) => `${field} must be a positive number`,
  MIN_VALUE: (field: string, min: number) => `${field} must be at least ${min}`,
} as const;

export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_ACTIVATED: 'User activated successfully',
  USER_SUSPENDED: 'User suspended successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  SCHOLARSHIP_CREATED: 'Scholarship created successfully',
  SCHOLARSHIP_UPDATED: 'Scholarship updated successfully',
  SCHOLARSHIP_PUBLISHED: 'Scholarship published successfully',
  SCHOLARSHIP_CLOSED: 'Scholarship closed successfully',
  APPLICATION_SUBMITTED: 'Application submitted successfully',
  APPLICATION_UPDATED: 'Application updated successfully',
  APPLICATION_APPROVED: 'Application approved successfully',
  APPLICATION_REJECTED: 'Application rejected successfully',
} as const;
