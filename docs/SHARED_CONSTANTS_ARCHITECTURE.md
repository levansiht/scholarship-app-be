# Shared Constants Architecture - Single Source of Truth

## Overview

All enums, validation schemas, and messages are now centralized in `src/shared/constants/` and used across ALL layers.

## New Structure

```
src/
├── shared/
│   └── constants/               # 🎯 SINGLE SOURCE OF TRUTH
│       ├── enums.ts            # TypeScript enums (UserRole, UserStatus, etc.)
│       ├── validation.ts       # Zod schemas (UserRoleEnum, UserStatusEnum, etc.)
│       ├── messages.ts         # Error & success messages
│       └── index.ts            # Barrel export
│
├── core/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── user.entity.ts           # ✅ Imports from shared/constants
│   │   │   ├── scholarship.entity.ts    # ✅ Imports from shared/constants
│   │   │   ├── application.entity.ts    # ✅ Imports from shared/constants
│   │   │   └── index.ts                 # ✅ Re-exports from shared
│   │   │
│   │   ├── dtos/
│   │   │   ├── dto.constants.ts         # ✅ Re-exports from shared/constants
│   │   │   └── *.dto.schema.ts          # ✅ Uses dto.constants
│   │   │
│   │   └── schemas/
│   │       └── money.schema.ts          # ✅ Uses CurrencyEnum from shared
│   │
│   └── application/
│       ├── constants/
│       │   ├── enums.ts                 # ✅ Re-exports from shared/constants
│       │   ├── messages.ts              # ✅ Re-exports from shared/constants
│       │   └── index.ts
│       │
│       └── commands/
│           └── user/
│               ├── dtos/
│               │   └── user-command.constants.ts  # ✅ Re-exports from domain
│               └── *.handler.ts         # ✅ Uses application/constants
│
└── infras/
    └── repositories/
        ├── user.repository.ts           # ✅ Imports from domain/entities
        ├── scholarship.repository.ts    # ✅ Imports from domain/entities
        └── application.repository.ts    # ✅ Imports from domain/entities
```

## Before vs After

### ❌ Before (4 sources of truth):

```typescript
// 1. Domain entities defined their own enums
export enum UserRole {
  STUDENT,
  ADMIN,
  SPONSOR,
}

// 2. Prisma schema had duplicate enums
enum UserRole {
  STUDENT,
  ADMIN,
  SPONSOR,
}

// 3. Application layer duplicated enums
export enum UserRole {
  STUDENT,
  ADMIN,
  SPONSOR,
}

// 4. Zod schemas duplicated again
export const UserRoleEnum = z.enum(['STUDENT', 'ADMIN', 'SPONSOR']);
```

### ✅ After (1 source of truth):

```typescript
// src/shared/constants/enums.ts - SINGLE SOURCE
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  SPONSOR = 'SPONSOR',
}

// src/shared/constants/validation.ts - Derived from enums
export const UserRoleEnum = z.enum([
  UserRole.STUDENT,
  UserRole.ADMIN,
  UserRole.SPONSOR,
]);

// All other files just re-export or import:
export { UserRole } from '../../../shared/constants';
```

## Import Paths

### ✅ Direct Usage (when you need the actual enums):

```typescript
import { UserRole, UserStatus, Currency } from '../../shared/constants';
import { UserRoleEnum, CurrencyEnum } from '../../shared/constants';
import { USER_ERRORS, SUCCESS_MESSAGES } from '../../shared/constants';
```

### ✅ Re-export Pattern (for backward compatibility):

```typescript
// domain/entities/index.ts
export { UserRole, UserStatus } from '../../../shared/constants';

// core/application/constants/enums.ts
export { UserRole, UserStatus } from '../../../shared/constants';
```

## Benefits

1. **Single Source of Truth**: All enums defined once in `src/shared/constants/enums.ts`
2. **Type Safety**: TypeScript enums provide compile-time checking
3. **Runtime Validation**: Zod schemas derived from TypeScript enums
4. **Maintainability**: Change enum in 1 place, affects all usages
5. **Consistency**: All layers use same constants
6. **Clean Architecture**: Shared constants don't belong to any specific layer
7. **i18n Ready**: Messages centralized for future localization

## Validation Flow

```
User Input → Zod Schema (validation.ts) → TypeScript Enum (enums.ts) → Domain Entity → Database
              ↑                              ↑                           ↑
              |                              |                           |
         CurrencyEnum                    Currency                   Uses Currency enum
         (runtime)                      (compile-time)              for type safety
```

## Message Usage

```typescript
// Old way (inline strings):
throw new NotFoundException(`User with id ${userId} not found`);

// New way (centralized):
import { USER_ERRORS } from '../../shared/constants';
throw new NotFoundException(USER_ERRORS.NOT_FOUND(userId));
```

## Key Files

- **src/shared/constants/enums.ts**: TypeScript enums (UserRole, UserStatus, ScholarshipStatus, ApplicationStatus, Currency)
- **src/shared/constants/validation.ts**: Zod validation schemas derived from enums
- **src/shared/constants/messages.ts**: Error and success message factory functions
- **src/shared/constants/index.ts**: Barrel export for clean imports

## Migration Summary

✅ All domain entities now import from shared
✅ All DTOs use validation schemas from shared
✅ All command handlers use enums and messages from shared
✅ All repositories import from domain (which re-exports from shared)
✅ Build passing
✅ Lint passing
✅ No duplicate enum definitions
✅ Single source of truth established

## Next Steps

When adding new enums or messages:

1. Add to `src/shared/constants/enums.ts` (TypeScript enum)
2. Add to `src/shared/constants/validation.ts` (Zod schema)
3. Add messages to `src/shared/constants/messages.ts` if needed
4. All layers automatically have access via imports
