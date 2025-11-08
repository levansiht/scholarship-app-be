export interface ScholarshipRequirementProps {
  id: string;
  scholarshipId: string;
  title: string;
  description: string;
  isRequired: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export class ScholarshipRequirement {
  private constructor(private readonly props: ScholarshipRequirementProps) {}

  static create(props: ScholarshipRequirementProps): ScholarshipRequirement {
    return new ScholarshipRequirement(props);
  }

  get id(): string {
    return this.props.id;
  }

  get scholarshipId(): string {
    return this.props.scholarshipId;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get isRequired(): boolean {
    return this.props.isRequired;
  }

  get displayOrder(): number {
    return this.props.displayOrder;
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
      scholarshipId: this.scholarshipId,
      title: this.title,
      description: this.description,
      isRequired: this.isRequired,
      displayOrder: this.displayOrder,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
