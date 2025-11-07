import { StudentProfile } from '../../entities/student-profile.entity';

export interface CreateStudentProfileData {
  userId: string;
  studentId?: string;
  university: string;
  major: string;
  yearOfStudy: number;
  gpa: number;
  expectedGradYear: number;
  skills: string[];
  interests: string[];
  achievements?: any;
}

export interface UpdateStudentProfileData {
  studentId?: string;
  university?: string;
  major?: string;
  yearOfStudy?: number;
  gpa?: number;
  expectedGradYear?: number;
  skills?: string[];
  interests?: string[];
  achievements?: any;
}

export interface IStudentProfileRepository {
  create(data: CreateStudentProfileData): Promise<StudentProfile>;
  findByUserId(userId: string): Promise<StudentProfile | null>;
  findById(id: string): Promise<StudentProfile | null>;
  update(
    userId: string,
    data: UpdateStudentProfileData,
  ): Promise<StudentProfile>;
  exists(userId: string): Promise<boolean>;
}

export const STUDENT_PROFILE_REPOSITORY = Symbol('STUDENT_PROFILE_REPOSITORY');
