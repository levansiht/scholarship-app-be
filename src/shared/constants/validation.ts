import { z } from 'zod';
import {
  UserRole,
  UserStatus,
  ScholarshipStatus,
  ApplicationStatus,
  Currency,
} from './enums';
import { GENERAL_VALIDATION_MESSAGES } from './validation-messages';

export const UserRoleEnum = z.enum(
  [UserRole.STUDENT, UserRole.ADMIN, UserRole.SPONSOR],
  {
    message: 'Role must be STUDENT, ADMIN, or SPONSOR',
  },
);

export const UserStatusEnum = z.enum(
  [UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.SUSPENDED],
  {
    message: 'Status must be ACTIVE, INACTIVE, or SUSPENDED',
  },
);

export const CurrencyEnum = z.enum([Currency.VND, Currency.USD], {
  message: 'Currency must be VND or USD',
});

export const ScholarshipStatusEnum = z.enum(
  [
    ScholarshipStatus.DRAFT,
    ScholarshipStatus.OPEN,
    ScholarshipStatus.CLOSED,
    ScholarshipStatus.SUSPENDED,
    ScholarshipStatus.EXPIRED,
  ],
  {
    message: 'Status must be DRAFT, OPEN, CLOSED, SUSPENDED, or EXPIRED',
  },
);

export const ApplicationStatusEnum = z.enum([
  ApplicationStatus.DRAFT,
  ApplicationStatus.SUBMITTED,
  ApplicationStatus.UNDER_REVIEW,
  ApplicationStatus.APPROVED,
  ApplicationStatus.REJECTED,
  ApplicationStatus.AWARDED,
  ApplicationStatus.WITHDRAWN,
  ApplicationStatus.CANCELLED,
]);

export const UuidSchema = z
  .string()
  .uuid(GENERAL_VALIDATION_MESSAGES.UUID.INVALID);
