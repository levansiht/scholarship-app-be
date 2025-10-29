// DTOs (interfaces)
export type { CreateUserDto, UpdateUserDto, UserFilterDto } from './user.dto';
export type {
  CreateScholarshipDto,
  UpdateScholarshipDto,
} from './scholarship.dto';
export type {
  CreateApplicationDto,
  UpdateApplicationDto,
} from './application.dto';

// DTO Constants - Re-export from shared for convenience
export {
  UserRoleEnum,
  UserStatusEnum,
  CurrencyEnum as ScholarshipCurrencyEnum,
  ScholarshipStatusEnum,
  ApplicationStatusEnum,
  UuidSchema,
} from '../../../shared/constants';

// DTO Validation Schemas (Zod)
export {
  CreateUserDtoSchema,
  UpdateUserDtoSchema,
  UserFilterDtoSchema,
  validateCreateUserDto,
  validateUpdateUserDto,
  validateUserFilterDto,
  type CreateUserDtoType,
  type UpdateUserDtoType,
  type UserFilterDtoType,
} from './user.dto.schema';

export {
  CreateScholarshipDtoSchema,
  UpdateScholarshipDtoSchema,
  validateCreateScholarshipDto,
  validateUpdateScholarshipDto,
  type CreateScholarshipDtoType,
  type UpdateScholarshipDtoType,
} from './scholarship.dto.schema';

export {
  CreateApplicationDtoSchema,
  UpdateApplicationDtoSchema,
  validateCreateApplicationDto,
  validateUpdateApplicationDto,
  type CreateApplicationDtoType,
  type UpdateApplicationDtoType,
} from './application.dto.schema';
