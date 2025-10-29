import { ApplicationStatus } from '../../../shared/constants';

export interface ApplicationProps {
  id: string;
  scholarshipId: string;
  applicantId: string;
  status: ApplicationStatus;
  coverLetter: string | null;
  additionalInfo: Record<string, unknown> | null;
  submittedAt: Date | null;
  reviewedAt: Date | null;
  decidedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Application {
  private _id: string;
  private _scholarshipId: string;
  private _applicantId: string;
  private _status: ApplicationStatus;
  private _coverLetter: string | null;
  private _additionalInfo: Record<string, unknown> | null;
  private _submittedAt: Date | null;
  private _reviewedAt: Date | null;
  private _decidedAt: Date | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: ApplicationProps) {
    this._id = props.id;
    this._scholarshipId = props.scholarshipId;
    this._applicantId = props.applicantId;
    this._status = props.status;
    this._coverLetter = props.coverLetter;
    this._additionalInfo = props.additionalInfo;
    this._submittedAt = props.submittedAt;
    this._reviewedAt = props.reviewedAt;
    this._decidedAt = props.decidedAt;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: ApplicationProps): Application {
    return new Application(props);
  }

  get id(): string {
    return this._id;
  }

  get scholarshipId(): string {
    return this._scholarshipId;
  }

  get applicantId(): string {
    return this._applicantId;
  }

  get status(): ApplicationStatus {
    return this._status;
  }

  get coverLetter(): string | null {
    return this._coverLetter;
  }

  get additionalInfo(): Record<string, unknown> | null {
    return this._additionalInfo;
  }

  get submittedAt(): Date | null {
    return this._submittedAt;
  }

  get reviewedAt(): Date | null {
    return this._reviewedAt;
  }

  get decidedAt(): Date | null {
    return this._decidedAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  isDraft(): boolean {
    return this._status === ApplicationStatus.DRAFT;
  }

  isSubmitted(): boolean {
    return this._status === ApplicationStatus.SUBMITTED;
  }

  isUnderReview(): boolean {
    return this._status === ApplicationStatus.UNDER_REVIEW;
  }

  isApproved(): boolean {
    return this._status === ApplicationStatus.APPROVED;
  }

  isRejected(): boolean {
    return this._status === ApplicationStatus.REJECTED;
  }

  isAwarded(): boolean {
    return this._status === ApplicationStatus.AWARDED;
  }

  isWithdrawn(): boolean {
    return this._status === ApplicationStatus.WITHDRAWN;
  }

  isCancelled(): boolean {
    return this._status === ApplicationStatus.CANCELLED;
  }

  canBeEdited(): boolean {
    return this.isDraft();
  }

  canBeSubmitted(): boolean {
    return this.isDraft();
  }

  canBeWithdrawn(): boolean {
    return this.isSubmitted() || this.isUnderReview();
  }

  canBeReviewed(): boolean {
    return this.isSubmitted() || this.isUnderReview();
  }

  submit(): void {
    if (!this.canBeSubmitted()) {
      throw new Error('Only draft applications can be submitted');
    }
    this._status = ApplicationStatus.SUBMITTED;
    this._submittedAt = new Date();
    this._updatedAt = new Date();
  }

  startReview(): void {
    if (!this.isSubmitted()) {
      throw new Error('Only submitted applications can be reviewed');
    }
    this._status = ApplicationStatus.UNDER_REVIEW;
    this._reviewedAt = new Date();
    this._updatedAt = new Date();
  }

  approve(): void {
    if (!this.canBeReviewed()) {
      throw new Error(
        'Only submitted or under review applications can be approved',
      );
    }
    this._status = ApplicationStatus.APPROVED;
    this._decidedAt = new Date();
    this._updatedAt = new Date();
  }

  reject(): void {
    if (!this.canBeReviewed()) {
      throw new Error(
        'Only submitted or under review applications can be rejected',
      );
    }
    this._status = ApplicationStatus.REJECTED;
    this._decidedAt = new Date();
    this._updatedAt = new Date();
  }

  award(): void {
    if (!this.isApproved()) {
      throw new Error('Only approved applications can be awarded');
    }
    this._status = ApplicationStatus.AWARDED;
    this._updatedAt = new Date();
  }

  withdraw(): void {
    if (!this.canBeWithdrawn()) {
      throw new Error('Application cannot be withdrawn in current status');
    }
    this._status = ApplicationStatus.WITHDRAWN;
    this._updatedAt = new Date();
  }

  cancel(): void {
    if (this.isApproved() || this.isAwarded()) {
      throw new Error('Cannot cancel approved or awarded applications');
    }
    this._status = ApplicationStatus.CANCELLED;
    this._updatedAt = new Date();
  }

  updateCoverLetter(coverLetter: string): void {
    if (!this.canBeEdited()) {
      throw new Error('Cannot edit submitted application');
    }
    this._coverLetter = coverLetter;
    this._updatedAt = new Date();
  }

  updateAdditionalInfo(info: Record<string, unknown>): void {
    if (!this.canBeEdited()) {
      throw new Error('Cannot edit submitted application');
    }
    this._additionalInfo = info;
    this._updatedAt = new Date();
  }
}
