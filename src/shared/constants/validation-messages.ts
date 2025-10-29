export const USER_VALIDATION_MESSAGES = {
  EMAIL: {
    INVALID: 'Invalid email format',
    MIN_LENGTH: `Email must be at least ${5} characters`,
    MAX_LENGTH: `Email must not exceed ${255} characters`,
  },
  PASSWORD: {
    MIN_LENGTH: `Password must be at least ${8} characters`,
    MAX_LENGTH: `Password must not exceed ${100} characters`,
    REQUIRED: 'Password is required',
    WEAK: 'Password does not meet security requirements',
    UPPERCASE: 'Password must contain at least one uppercase letter',
    LOWERCASE: 'Password must contain at least one lowercase letter',
    NUMBER: 'Password must contain at least one number',
    SPECIAL_CHAR: 'Password must contain at least one special character',
  },
  ROLE: {
    INVALID: 'Role must be STUDENT, ADMIN, or SPONSOR',
  },
  STATUS: {
    INVALID: 'Status must be ACTIVE, INACTIVE, or SUSPENDED',
  },
  SUSPENSION_REASON: {
    MIN_LENGTH: `Suspension reason must be at least ${10} characters`,
    MAX_LENGTH: `Suspension reason must not exceed ${500} characters`,
    REQUIRED: 'Suspension reason is required',
  },
} as const;

export const SCHOLARSHIP_VALIDATION_MESSAGES = {
  TITLE: {
    MIN_LENGTH: `Title must be at least ${10} characters`,
    MAX_LENGTH: `Title must not exceed ${200} characters`,
    REQUIRED: 'Title is required',
  },
  SLUG: {
    MIN_LENGTH: `Slug must be at least ${3} characters`,
    MAX_LENGTH: `Slug must not exceed ${250} characters`,
    INVALID_FORMAT: 'Slug must be lowercase with hyphens only',
    REQUIRED: 'Slug is required',
  },
  DESCRIPTION: {
    MIN_LENGTH: `Description must be at least ${50} characters`,
    MAX_LENGTH: `Description must not exceed ${5000} characters`,
    REQUIRED: 'Description is required',
  },
  AMOUNT: {
    POSITIVE: 'Amount must be positive',
    NON_NEGATIVE: 'Amount must be non-negative',
    REQUIRED: 'Amount is required',
  },
  CURRENCY: {
    INVALID: 'Currency must be VND or USD',
  },
  NUMBER_OF_SLOTS: {
    POSITIVE: 'Number of slots must be positive',
    INTEGER: 'Number of slots must be an integer',
    REQUIRED: 'Number of slots is required',
  },
  DEADLINE: {
    INVALID: 'Deadline must be a valid date',
    FUTURE: 'Deadline must be in the future',
    REQUIRED: 'Deadline is required',
  },
  START_DATE: {
    INVALID: 'Start date must be a valid date',
    REQUIRED: 'Start date is required',
  },
  END_DATE: {
    INVALID: 'End date must be a valid date',
  },
  STATUS: {
    INVALID: 'Status must be DRAFT, OPEN, CLOSED, SUSPENDED, or EXPIRED',
  },
  THUMBNAIL_URL: {
    INVALID: 'Thumbnail URL must be valid',
  },
} as const;

export const APPLICATION_VALIDATION_MESSAGES = {
  SCHOLARSHIP_ID: {
    INVALID: 'Scholarship ID must be a valid UUID',
    REQUIRED: 'Scholarship ID is required',
  },
  APPLICANT_ID: {
    INVALID: 'Applicant ID must be a valid UUID',
    REQUIRED: 'Applicant ID is required',
  },
  COVER_LETTER: {
    MIN_LENGTH: `Cover letter must be at least ${100} characters`,
    MAX_LENGTH: `Cover letter must not exceed ${2000} characters`,
  },
  STATUS: {
    INVALID:
      'Status must be DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, AWARDED, WITHDRAWN, or CANCELLED',
  },
} as const;

export const GENERAL_VALIDATION_MESSAGES = {
  UUID: {
    INVALID: 'Must be a valid UUID',
  },
  GPA: {
    MIN_VALUE: `GPA must be at least ${0}`,
    MAX_VALUE: `GPA must not exceed ${4}`,
    INVALID: 'GPA must be a valid number',
  },
  REQUIRED: 'This field is required',
  POSITIVE_NUMBER: 'Must be a positive number',
  DATE_INVALID: 'Must be a valid date',
} as const;
