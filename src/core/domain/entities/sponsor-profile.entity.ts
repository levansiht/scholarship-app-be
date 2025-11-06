export interface SponsorProfileProps {
  id: string;
  userId: string;
  organizationName: string;
  organizationType: string;
  website?: string;
  description: string;
  logo?: string;
  taxId?: string;
  contactEmail: string;
  verified: boolean;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class SponsorProfile {
  private constructor(private readonly props: SponsorProfileProps) {}

  static create(props: SponsorProfileProps): SponsorProfile {
    return new SponsorProfile(props);
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get organizationName(): string {
    return this.props.organizationName;
  }

  get organizationType(): string {
    return this.props.organizationType;
  }

  get website(): string | undefined {
    return this.props.website;
  }

  get description(): string {
    return this.props.description;
  }

  get logo(): string | undefined {
    return this.props.logo;
  }

  get taxId(): string | undefined {
    return this.props.taxId;
  }

  get contactEmail(): string {
    return this.props.contactEmail;
  }

  get verified(): boolean {
    return this.props.verified;
  }

  get verifiedAt(): Date | undefined {
    return this.props.verifiedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      organizationName: this.organizationName,
      organizationType: this.organizationType,
      website: this.website,
      description: this.description,
      logo: this.logo,
      taxId: this.taxId,
      contactEmail: this.contactEmail,
      verified: this.verified,
      verifiedAt: this.verifiedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
