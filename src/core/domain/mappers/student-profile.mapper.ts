import { StudentProfile as PrismaStudentProfile, Prisma } from '@prisma/client';
import {
  StudentProfile,
  StudentProfileProps,
} from '../entities/student-profile.entity';

export class StudentProfileMapper {
  static toDomain(prisma: PrismaStudentProfile): StudentProfile | null {
    if (!prisma) return null;

    const props: StudentProfileProps = {
      id: prisma.id,
      userId: prisma.userId,
      studentId: prisma.studentId ?? undefined,
      university: prisma.university,
      major: prisma.major,
      yearOfStudy: prisma.yearOfStudy,
      gpa: prisma.gpa.toNumber(), // Convert Decimal to number
      expectedGradYear: prisma.expectedGradYear,
      skills: prisma.skills,
      interests: prisma.interests,
      achievements: prisma.achievements ?? undefined,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    };

    return StudentProfile.create(props);
  }

  static toPrisma(domain: StudentProfile): Prisma.StudentProfileCreateInput {
    return {
      id: domain.id,
      studentId: domain.studentId ?? null,
      university: domain.university,
      major: domain.major,
      yearOfStudy: domain.yearOfStudy,
      gpa: domain.gpa, // Prisma will convert to Decimal
      expectedGradYear: domain.expectedGradYear,
      skills: domain.skills,
      interests: domain.interests,
      achievements: domain.achievements ?? null,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      user: {
        connect: { id: domain.userId },
      },
    };
  }
}
