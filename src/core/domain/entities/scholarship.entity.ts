import { Money } from '../value-objects';

export enum ScholarshipStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
}

export interface ScholarshipProps {
  id: string;
  createdBy: string;
  title: string;
  slug: string;
  description: string;
  amount: Money;
  numberOfSlots: number;
  availableSlots: number;
  deadline: Date;
  startDate: Date;
  endDate: Date | null;
  status: ScholarshipStatus;
  featured: boolean;
  views: number;
  isRecurring: boolean;
  thumbnailUrl: string | null;
  tags: string[];
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Scholarship {
  private _id: string;
  private _createdBy: string;
  private _title: string;
  private _slug: string;
  private _description: string;
  private _amount: Money;
  private _numberOfSlots: number;
  private _availableSlots: number;
  private _deadline: Date;
  private _startDate: Date;
  private _endDate: Date | null;
  private _status: ScholarshipStatus;
  private _featured: boolean;
  private _views: number;
  private _isRecurring: boolean;
  private _thumbnailUrl: string | null;
  private _tags: string[];
  private _publishedAt: Date | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: ScholarshipProps) {
    this._id = props.id;
    this._createdBy = props.createdBy;
    this._title = props.title;
    this._slug = props.slug;
    this._description = props.description;
    this._amount = props.amount;
    this._numberOfSlots = props.numberOfSlots;
    this._availableSlots = props.availableSlots;
    this._deadline = props.deadline;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._status = props.status;
    this._featured = props.featured;
    this._views = props.views;
    this._isRecurring = props.isRecurring;
    this._thumbnailUrl = props.thumbnailUrl;
    this._tags = props.tags;
    this._publishedAt = props.publishedAt;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: ScholarshipProps): Scholarship {
    return new Scholarship(props);
  }

  get id(): string {
    return this._id;
  }

  get createdBy(): string {
    return this._createdBy;
  }

  get title(): string {
    return this._title;
  }

  get slug(): string {
    return this._slug;
  }

  get description(): string {
    return this._description;
  }

  get amount(): Money {
    return this._amount;
  }

  get numberOfSlots(): number {
    return this._numberOfSlots;
  }

  get availableSlots(): number {
    return this._availableSlots;
  }

  get deadline(): Date {
    return this._deadline;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get endDate(): Date | null {
    return this._endDate;
  }

  get status(): ScholarshipStatus {
    return this._status;
  }

  get featured(): boolean {
    return this._featured;
  }

  get views(): number {
    return this._views;
  }

  get isRecurring(): boolean {
    return this._isRecurring;
  }

  get thumbnailUrl(): string | null {
    return this._thumbnailUrl;
  }

  get tags(): string[] {
    return [...this._tags];
  }

  get publishedAt(): Date | null {
    return this._publishedAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  isDraft(): boolean {
    return this._status === ScholarshipStatus.DRAFT;
  }

  isOpen(): boolean {
    return this._status === ScholarshipStatus.OPEN;
  }

  isClosed(): boolean {
    return this._status === ScholarshipStatus.CLOSED;
  }

  isExpired(): boolean {
    return this._status === ScholarshipStatus.EXPIRED;
  }

  isSuspended(): boolean {
    return this._status === ScholarshipStatus.SUSPENDED;
  }

  hasAvailableSlots(): boolean {
    return this._availableSlots > 0;
  }

  isDeadlinePassed(): boolean {
    return new Date() > this._deadline;
  }

  publish(): void {
    if (!this.isDraft()) {
      throw new Error('Only draft scholarships can be published');
    }
    if (this.isDeadlinePassed()) {
      throw new Error('Cannot publish scholarship with passed deadline');
    }
    this._status = ScholarshipStatus.OPEN;
    this._publishedAt = new Date();
    this._updatedAt = new Date();
  }

  close(): void {
    if (!this.isOpen()) {
      throw new Error('Only open scholarships can be closed');
    }
    this._status = ScholarshipStatus.CLOSED;
    this._updatedAt = new Date();
  }

  suspend(): void {
    if (this.isSuspended()) {
      throw new Error('Scholarship is already suspended');
    }
    if (this.isClosed() || this.isExpired()) {
      throw new Error('Cannot suspend closed or expired scholarship');
    }
    this._status = ScholarshipStatus.SUSPENDED;
    this._updatedAt = new Date();
  }

  reopen(): void {
    if (!this.isSuspended()) {
      throw new Error('Only suspended scholarships can be reopened');
    }
    if (this.isDeadlinePassed()) {
      throw new Error('Cannot reopen scholarship with passed deadline');
    }
    this._status = ScholarshipStatus.OPEN;
    this._updatedAt = new Date();
  }

  expire(): void {
    if (this.isExpired()) {
      throw new Error('Scholarship is already expired');
    }
    this._status = ScholarshipStatus.EXPIRED;
    this._updatedAt = new Date();
  }

  decreaseAvailableSlots(): void {
    if (!this.hasAvailableSlots()) {
      throw new Error('No available slots');
    }
    this._availableSlots--;
    this._updatedAt = new Date();

    if (this._availableSlots === 0) {
      this.close();
    }
  }

  increaseAvailableSlots(): void {
    if (this._availableSlots >= this._numberOfSlots) {
      throw new Error('Cannot exceed total number of slots');
    }
    this._availableSlots++;
    this._updatedAt = new Date();
  }

  incrementViews(): void {
    this._views++;
    this._updatedAt = new Date();
  }

  updateDetails(title: string, description: string): void {
    if (!this.isDraft()) {
      throw new Error('Can only update details of draft scholarships');
    }
    this._title = title;
    this._description = description;
    this._updatedAt = new Date();
  }

  updateDeadline(newDeadline: Date): void {
    if (!this.isDraft() && !this.isOpen()) {
      throw new Error('Can only update deadline of draft or open scholarships');
    }
    if (newDeadline <= new Date()) {
      throw new Error('Deadline must be in the future');
    }
    this._deadline = newDeadline;
    this._updatedAt = new Date();
  }

  canAcceptApplications(): boolean {
    return (
      this.isOpen() && this.hasAvailableSlots() && !this.isDeadlinePassed()
    );
  }
}
