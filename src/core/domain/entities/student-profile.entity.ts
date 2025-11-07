export interface StudentProfileProps {
  id: string;
  userId: string;
  studentId?: string; // Student ID number (optional)
  university: string;
  major: string;
  yearOfStudy: number; // 1-6 for undergraduate/graduate
  expectedGradYear: number; // Year (e.g., 2025)
  gpa: number; // 0.00-4.00
  skills: string[];
  interests: string[];
  achievements?: any; // JSON data for achievements
  createdAt: Date;
  updatedAt: Date;
}

export class StudentProfile {
  private constructor(private readonly props: StudentProfileProps) {}

  static create(props: StudentProfileProps): StudentProfile {
    // Validate GPA range
    if (props.gpa < 0 || props.gpa > 4) {
      throw new Error('GPA must be between 0.00 and 4.00');
    }

    // Validate year of study
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

  get achievements(): any | undefined {
    return this.props.achievements;
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
