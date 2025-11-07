import { BaseCommand } from '../../../common';

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

export class CreateStudentProfileCommand extends BaseCommand {
  constructor(public readonly data: CreateStudentProfileData) {
    super();
  }
}
