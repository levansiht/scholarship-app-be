import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import {
  IStudentProfileRepository,
  CreateStudentProfileData,
  UpdateStudentProfileData,
} from '../../core/domain/interfaces/repositories/student-profile.repository.interface';
import { StudentProfile } from '../../core/domain/entities/student-profile.entity';
import { StudentProfileMapper } from '../../core/domain/mappers/student-profile.mapper';

@Injectable()
export class StudentProfileRepository implements IStudentProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateStudentProfileData): Promise<StudentProfile> {
    // Check if profile already exists
    const existing = await this.prisma.studentProfile.findUnique({
      where: { userId: data.userId },
    });

    if (existing) {
      throw new ConflictException(
        'Student profile already exists for this user',
      );
    }

    const profile = await this.prisma.studentProfile.create({
      data: {
        userId: data.userId,
        studentId: data.studentId ?? null,
        university: data.university,
        major: data.major,
        yearOfStudy: data.yearOfStudy,
        gpa: data.gpa,
        expectedGradYear: data.expectedGradYear,
        skills: data.skills,
        interests: data.interests,
        achievements: data.achievements ?? null,
      },
    });

    const domainProfile = StudentProfileMapper.toDomain(profile);
    if (!domainProfile) {
      throw new Error('Failed to map student profile to domain');
    }

    return domainProfile;
  }

  async findByUserId(userId: string): Promise<StudentProfile | null> {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return null;
    }

    return StudentProfileMapper.toDomain(profile);
  }

  async findById(id: string): Promise<StudentProfile | null> {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { id },
    });

    if (!profile) {
      return null;
    }

    return StudentProfileMapper.toDomain(profile);
  }

  async update(
    userId: string,
    data: UpdateStudentProfileData,
  ): Promise<StudentProfile> {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException(
        `Student profile not found for user ${userId}`,
      );
    }

    const updated = await this.prisma.studentProfile.update({
      where: { userId },
      data: {
        studentId: data.studentId ?? undefined,
        university: data.university,
        major: data.major,
        yearOfStudy: data.yearOfStudy,
        gpa: data.gpa,
        expectedGradYear: data.expectedGradYear,
        skills: data.skills,
        interests: data.interests,
        achievements: data.achievements ?? undefined,
      },
    });

    const domainProfile = StudentProfileMapper.toDomain(updated);
    if (!domainProfile) {
      throw new Error('Failed to map updated student profile to domain');
    }

    return domainProfile;
  }

  async exists(userId: string): Promise<boolean> {
    const count = await this.prisma.studentProfile.count({
      where: { userId },
    });

    return count > 0;
  }
}
