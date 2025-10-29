export const USER_CONSTRAINTS = {
  EMAIL: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 255,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 100,
  },
  SUSPENSION_REASON: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500,
  },
} as const;

export const SCHOLARSHIP_CONSTRAINTS = {
  TITLE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 200,
  },
  SLUG: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 250,
    PATTERN: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  },
  DESCRIPTION: {
    MIN_LENGTH: 50,
    MAX_LENGTH: 5000,
  },
} as const;

export const APPLICATION_CONSTRAINTS = {
  COVER_LETTER: {
    MIN_LENGTH: 100,
    MAX_LENGTH: 2000,
  },
} as const;

export const GENERAL_CONSTRAINTS = {
  GPA: {
    MIN_VALUE: 0,
    MAX_VALUE: 4,
  },
  UUID: {
    PATTERN: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  },
} as const;
