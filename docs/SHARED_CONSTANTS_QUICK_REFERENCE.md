# Quick Reference: Using Shared Constants

## Import Examples

### TypeScript Enums (for logic)

```typescript
import { UserRole, UserStatus, ScholarshipStatus, ApplicationStatus, Currency } from '../../shared/constants';

// Usage in code:
if (user.role === UserRole.ADMIN) { ... }
status = UserStatus.ACTIVE;
```

### Zod Schemas (for validation)

```typescript
import {
  UserRoleEnum,
  UserStatusEnum,
  CurrencyEnum,
} from '../../shared/constants';

// Usage in DTOs:
const schema = z.object({
  role: UserRoleEnum,
  status: UserStatusEnum.optional(),
  currency: CurrencyEnum,
});
```

### Error Messages

```typescript
import {
  USER_ERRORS,
  SCHOLARSHIP_ERRORS,
  APPLICATION_ERRORS,
} from '../../shared/constants';

// Usage in handlers:
throw new NotFoundException(USER_ERRORS.NOT_FOUND(userId));
throw new ConflictException(USER_ERRORS.EMAIL_EXISTS(email));
throw new BadRequestException(SCHOLARSHIP_ERRORS.DEADLINE_PASSED);
```

### Success Messages

```typescript
import { SUCCESS_MESSAGES } from '../../shared/constants';

// Usage in handlers:
return { message: SUCCESS_MESSAGES.USER_CREATED };
```

## Available Enums

### UserRole

- `UserRole.STUDENT`
- `UserRole.ADMIN`
- `UserRole.SPONSOR`

### UserStatus

- `UserStatus.ACTIVE`
- `UserStatus.INACTIVE`
- `UserStatus.SUSPENDED`

### ScholarshipStatus

- `ScholarshipStatus.DRAFT`
- `ScholarshipStatus.OPEN`
- `ScholarshipStatus.CLOSED`
- `ScholarshipStatus.SUSPENDED`
- `ScholarshipStatus.EXPIRED`

### ApplicationStatus

- `ApplicationStatus.DRAFT`
- `ApplicationStatus.SUBMITTED`
- `ApplicationStatus.UNDER_REVIEW`
- `ApplicationStatus.APPROVED`
- `ApplicationStatus.REJECTED`
- `ApplicationStatus.AWARDED`
- `ApplicationStatus.WITHDRAWN`
- `ApplicationStatus.CANCELLED`

### Currency

- `Currency.VND`
- `Currency.USD`

## Available Error Messages

### USER_ERRORS

- `NOT_FOUND(userId: string)`
- `EMAIL_EXISTS(email: string)`
- `EMAIL_NOT_FOUND(email: string)`
- `ALREADY_ACTIVE`
- `ALREADY_SUSPENDED`
- `ALREADY_INACTIVE`
- `OLD_PASSWORD_INCORRECT`
- `PASSWORD_MUST_DIFFER`
- `CANNOT_SUSPEND_SELF`
- `INSUFFICIENT_PERMISSIONS`

### SCHOLARSHIP_ERRORS

- `NOT_FOUND(scholarshipId: string)`
- `ALREADY_PUBLISHED`
- `ALREADY_CLOSED`
- `ALREADY_SUSPENDED`
- `ALREADY_EXPIRED`
- `NO_SLOTS_AVAILABLE`
- `DEADLINE_PASSED`
- `NOT_OPEN`
- `INVALID_DATE_RANGE`
- `INVALID_DEADLINE`
- `CANNOT_MODIFY_PUBLISHED`

### APPLICATION_ERRORS

- `NOT_FOUND(applicationId: string)`
- `ALREADY_SUBMITTED`
- `ALREADY_APPROVED`
- `ALREADY_REJECTED`
- `ALREADY_WITHDRAWN`
- `SCHOLARSHIP_CLOSED`
- `NO_SLOTS`
- `DUPLICATE_APPLICATION`
- `CANNOT_MODIFY_SUBMITTED`
- `INVALID_STATUS_TRANSITION(from: string, to: string)`

### VALIDATION_ERRORS

- `INVALID_UUID(field: string)`
- `REQUIRED_FIELD(field: string)`
- `MIN_LENGTH(field: string, min: number)`
- `MAX_LENGTH(field: string, max: number)`
- `INVALID_EMAIL`
- `INVALID_DATE`
- `POSITIVE_NUMBER(field: string)`
- `MIN_VALUE(field: string, min: number)`

### SUCCESS_MESSAGES

- `USER_CREATED`
- `USER_UPDATED`
- `USER_ACTIVATED`
- `USER_SUSPENDED`
- `PASSWORD_CHANGED`
- `SCHOLARSHIP_CREATED`
- `SCHOLARSHIP_UPDATED`
- `SCHOLARSHIP_PUBLISHED`
- `SCHOLARSHIP_CLOSED`
- `APPLICATION_SUBMITTED`
- `APPLICATION_UPDATED`
- `APPLICATION_APPROVED`
- `APPLICATION_REJECTED`

## Common Patterns

### 1. Entity Creation

```typescript
import { UserRole, UserStatus } from '../../shared/constants';

const user = User.create({
  role: UserRole.STUDENT,
  status: UserStatus.ACTIVE,
  // ...
});
```

### 2. DTO Validation

```typescript
import { UserRoleEnum, UserStatusEnum } from '../../shared/constants';

const CreateUserSchema = z.object({
  role: UserRoleEnum,
  status: UserStatusEnum.optional(),
  // ...
});
```

### 3. Error Handling

```typescript
import { USER_ERRORS } from '../../shared/constants';
import { NotFoundException } from '@nestjs/common';

const user = await this.repository.findById(id);
if (!user) {
  throw new NotFoundException(USER_ERRORS.NOT_FOUND(id));
}
```

### 4. Status Comparison

```typescript
import { UserStatus, ScholarshipStatus } from '../../shared/constants';

// Type-safe comparison
if (user.status === UserStatus.ACTIVE) { ... }
if (scholarship.status === ScholarshipStatus.OPEN) { ... }

// Using domain methods
if (user.isActive()) { ... }  // Still works!
if (scholarship.isOpen()) { ... }
```

## Migration from Old Code

### Before (inline strings)

```typescript
status: 'ACTIVE'; // ❌ Not type-safe
role: z.enum(['STUDENT', 'ADMIN']); // ❌ Duplicate definition
throw new Error(`User with id ${id} not found`); // ❌ Inconsistent
```

### After (shared constants)

```typescript
status: UserStatus.ACTIVE; // ✅ Type-safe
role: UserRoleEnum; // ✅ Reusable
throw new NotFoundException(USER_ERRORS.NOT_FOUND(id)); // ✅ Consistent
```

## Remember

1. **Always import from `shared/constants`** - Never define enums inline
2. **Use TypeScript enums** for logic - `UserRole.ADMIN`
3. **Use Zod schemas** for validation - `UserRoleEnum`
4. **Use message constants** for errors - `USER_ERRORS.NOT_FOUND()`
5. **Single source of truth** - All enums in `src/shared/constants/enums.ts`
