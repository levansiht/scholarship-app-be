export interface EligibilityCriteriaProps {
  id: string;
  scholarshipId: string;
  minGpa?: number; // Minimum GPA required (0.00-4.00)
  maxGpa?: number; // Maximum GPA allowed (0.00-4.00)
  allowedMajors: string[]; // List of allowed majors (empty = all majors)
  allowedYearOfStudy: number[]; // List of allowed years (e.g., [1,2,3,4])
  minAge?: number; // Minimum age requirement
  maxAge?: number; // Maximum age requirement
  requiredNationality?: string; // Required nationality (null = any)
  otherRequirements?: string; // Additional text requirements
  createdAt: Date;
  updatedAt: Date;
}

export class EligibilityCriteria {
  private constructor(private readonly props: EligibilityCriteriaProps) {}

  static create(props: EligibilityCriteriaProps): EligibilityCriteria {
    // Validate GPA range
    if (props.minGpa !== undefined && (props.minGpa < 0 || props.minGpa > 4)) {
      throw new Error('Minimum GPA must be between 0.00 and 4.00');
    }

    if (props.maxGpa !== undefined && (props.maxGpa < 0 || props.maxGpa > 4)) {
      throw new Error('Maximum GPA must be between 0.00 and 4.00');
    }

    if (props.minGpa && props.maxGpa && props.minGpa > props.maxGpa) {
      throw new Error('Minimum GPA cannot be greater than maximum GPA');
    }

    // Validate age range
    if (props.minAge && props.maxAge && props.minAge > props.maxAge) {
      throw new Error('Minimum age cannot be greater than maximum age');
    }

    return new EligibilityCriteria(props);
  }

  get id(): string {
    return this.props.id;
  }

  get scholarshipId(): string {
    return this.props.scholarshipId;
  }

  get minGpa(): number | undefined {
    return this.props.minGpa;
  }

  get maxGpa(): number | undefined {
    return this.props.maxGpa;
  }

  get allowedMajors(): string[] {
    return this.props.allowedMajors;
  }

  get allowedYearOfStudy(): number[] {
    return this.props.allowedYearOfStudy;
  }

  get minAge(): number | undefined {
    return this.props.minAge;
  }

  get maxAge(): number | undefined {
    return this.props.maxAge;
  }

  get requiredNationality(): string | undefined {
    return this.props.requiredNationality;
  }

  get otherRequirements(): string | undefined {
    return this.props.otherRequirements;
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
      minGpa: this.minGpa,
      maxGpa: this.maxGpa,
      allowedMajors: this.allowedMajors,
      allowedYearOfStudy: this.allowedYearOfStudy,
      minAge: this.minAge,
      maxAge: this.maxAge,
      requiredNationality: this.requiredNationality,
      otherRequirements: this.otherRequirements,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
