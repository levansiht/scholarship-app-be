import { Email, Password } from '../value-objects';
import { UserRole, UserStatus } from '../../../shared/constants';

export interface UserProps {
  id: string;
  email: Email;
  password: Password;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private _id: string;
  private _email: Email;
  private _password: Password;
  private _role: UserRole;
  private _status: UserStatus;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: UserProps) {
    this._id = props.id;
    this._email = props.email;
    this._password = props.password;
    this._role = props.role;
    this._status = props.status;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: UserProps): User {
    return new User(props);
  }

  get id(): string {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get password(): Password {
    return this._password;
  }

  get role(): UserRole {
    return this._role;
  }

  get status(): UserStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  isActive(): boolean {
    return this._status === UserStatus.ACTIVE;
  }

  isSuspended(): boolean {
    return this._status === UserStatus.SUSPENDED;
  }

  isStudent(): boolean {
    return this._role === UserRole.STUDENT;
  }

  isSponsor(): boolean {
    return this._role === UserRole.SPONSOR;
  }

  isAdmin(): boolean {
    return this._role === UserRole.ADMIN;
  }

  activate(): void {
    if (this._status === UserStatus.ACTIVE) {
      throw new Error('User is already active');
    }
    this._status = UserStatus.ACTIVE;
    this._updatedAt = new Date();
  }

  suspend(): void {
    if (this._status === UserStatus.SUSPENDED) {
      throw new Error('User is already suspended');
    }
    this._status = UserStatus.SUSPENDED;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    if (this._status === UserStatus.INACTIVE) {
      throw new Error('User is already inactive');
    }
    this._status = UserStatus.INACTIVE;
    this._updatedAt = new Date();
  }

  changePassword(newPassword: Password): void {
    if (!this.isActive()) {
      throw new Error('Cannot change password for inactive user');
    }
    this._password = newPassword;
    this._updatedAt = new Date();
  }

  changeEmail(newEmail: Email): void {
    if (!this.isActive()) {
      throw new Error('Cannot change email for inactive user');
    }
    this._email = newEmail;
    this._updatedAt = new Date();
  }

  canManageScholarships(): boolean {
    return this._role === UserRole.SPONSOR || this._role === UserRole.ADMIN;
  }

  canApplyForScholarships(): boolean {
    return this._role === UserRole.STUDENT && this.isActive();
  }

  canReviewApplications(): boolean {
    return this._role === UserRole.ADMIN;
  }
}
