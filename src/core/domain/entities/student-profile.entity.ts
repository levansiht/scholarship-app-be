import { Prisma } from '@prisma/client';

export interface StudentProfileProps {
  id: string;
  userId: string;
  studentId?: string;
  university: string;
  major: string;
  yearOfStudy: number;
  expectedGradYear: number;
  gpa: number;
  skills: string[];
  interests: string[];
  achievements?: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
}

export class StudentProfile {
  private constructor(private readonly props: StudentProfileProps) {}

  static create(props: StudentProfileProps): StudentProfile {
    if (props.gpa < 0 || props.gpa > 4) {
      throw new Error('GPA must be between 0.00 and 4.00');
    }

    if (props.yearOfStudy < 1 || props.yearOfStudy > 6) {
      throw new Error('Year of study must be between 1 and 6');
    }

    return new StudentProfile(props);
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get studentId(): string | undefined {
    return this.props.studentId;
  }

  get university(): string {
    return this.props.university;
  }

  get major(): string {
    return this.props.major;
  }

  get yearOfStudy(): number {
    return this.props.yearOfStudy;
  }

  get gpa(): number {
    return this.props.gpa;
  }

  get expectedGradYear(): number {
    return this.props.expectedGradYear;
  }

  get skills(): string[] {
    return this.props.skills;
  }

  get interests(): string[] {
    return this.props.interests;
  }

  get achievements(): Prisma.JsonValue | undefined {
    return this.props.achievements;
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
      userId: this.userId,
      studentId: this.studentId,
      university: this.university,
      major: this.major,
      yearOfStudy: this.yearOfStudy,
      gpa: this.gpa,
      expectedGradYear: this.expectedGradYear,
      skills: this.skills,
      interests: this.interests,
      achievements: this.achievements,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
