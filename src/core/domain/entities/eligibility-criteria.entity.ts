import { Prisma } from '@prisma/client';

export interface EligibilityCriteriaProps {
  id: string;
  scholarshipId: string;
  minGpa?: number;
  maxGpa?: number;
  allowedMajors: string[];
  allowedYearOfStudy: number[];
  minAge?: number;
  maxAge?: number;
  requiredNationality?: string;
  otherRequirements?: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
}

export class EligibilityCriteria {
  private constructor(private readonly props: EligibilityCriteriaProps) {}

  static create(props: EligibilityCriteriaProps): EligibilityCriteria {
    if (props.minGpa !== undefined && (props.minGpa < 0 || props.minGpa > 4)) {
      throw new Error('Minimum GPA must be between 0.00 and 4.00');
    }

    if (props.maxGpa !== undefined && (props.maxGpa < 0 || props.maxGpa > 4)) {
      throw new Error('Maximum GPA must be between 0.00 and 4.00');
    }

    if (props.minGpa && props.maxGpa && props.minGpa > props.maxGpa) {
      throw new Error('Minimum GPA cannot be greater than maximum GPA');
    }

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

  get otherRequirements(): Prisma.JsonValue | undefined {
    return this.props.otherRequirements;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toJSON(): Record<string, unknown> {
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
