export type { CreateUserDto, UpdateUserDto, UserFilterDto } from './user.dto';
export type {
  CreateScholarshipDto,
  UpdateScholarshipDto,
} from './scholarship.dto';
export type {
  CreateApplicationDto,
  UpdateApplicationDto,
} from './application.dto';

export {
  UserRoleEnum,
  UserStatusEnum,
  CurrencyEnum as ScholarshipCurrencyEnum,
  ScholarshipStatusEnum,
  ApplicationStatusEnum,
  UuidSchema,
} from '../../../shared/constants';

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

export { RegisterDtoSchema, type RegisterDto } from './register.dto.schema';

export { LoginDtoSchema, type LoginDto } from './login.dto.schema';

export {
  UpdateProfileDtoSchema,
  validateUpdateProfileDto,
  type UpdateProfileDtoType,
} from './profile.dto.schema';

export {
  UploadDocumentDtoSchema,
  validateUploadDocumentDto,
  type UploadDocumentDtoType,
} from './scholarship-document.dto.schema';

export {
  AddRequirementDtoSchema,
  UpdateRequirementDtoSchema,
  validateAddRequirementDto,
  validateUpdateRequirementDto,
  type AddRequirementDtoType,
  type UpdateRequirementDtoType,
} from './scholarship-requirement.dto.schema';
