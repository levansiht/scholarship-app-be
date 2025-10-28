import { Injectable } from '@nestjs/common';
import { ZodError } from 'zod';
import { PrismaService } from '../database/prisma/prisma.service';
import {
  IRepositoryApplication,
  PaginationParams,
  PaginatedResult,
} from '../../core/domain/interfaces/repositories';
import { ApplicationStatus, Prisma } from '@prisma/client';
import { Application } from '../../core/domain/entities';
import { ApplicationMapper } from '../../core/domain/mappers';
import {
  CreateApplicationDto,
  UpdateApplicationDto,
  validateCreateApplicationDto,
  validateUpdateApplicationDto,
} from '../../core/domain/dtos';

@Injectable()
export class ApplicationRepository implements IRepositoryApplication {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Application | null> {
    const prismaApplication = await this.prisma.application.findUnique({
      where: { id },
    });
    if (!prismaApplication) return null;
    return ApplicationMapper.toDomain(prismaApplication);
  }

  async findByStudent(studentId: string): Promise<Application[]> {
    const prismaApplications = await this.prisma.application.findMany({
      where: { applicantId: studentId },
      orderBy: { createdAt: 'desc' },
      include: {
        scholarship: true,
      },
    });
    return ApplicationMapper.toDomainArray(prismaApplications);
  }

  async findByScholarship(scholarshipId: string): Promise<Application[]> {
    const prismaApplications = await this.prisma.application.findMany({
      where: { scholarshipId },
      orderBy: { createdAt: 'desc' },
      include: {
        applicant: {
          select: {
            id: true,
            email: true,
            profile: true,
            studentProfile: true,
          },
        },
      },
    });
    return ApplicationMapper.toDomainArray(prismaApplications);
  }

  async findByStatus(status: string): Promise<Application[]> {
    const prismaApplications = await this.prisma.application.findMany({
      where: { status: status as ApplicationStatus },
      orderBy: { createdAt: 'desc' },
    });
    return ApplicationMapper.toDomainArray(prismaApplications);
  }

  async findWithRelations(id: string): Promise<Application | null> {
    const prismaApplication = await this.prisma.application.findUnique({
      where: { id },
      include: {
        documents: true,
        reviews: true,
        timeline: {
          orderBy: { createdAt: 'asc' },
        },
        applicant: {
          include: {
            profile: true,
            studentProfile: true,
          },
        },
        scholarship: true,
      },
    });
    if (!prismaApplication) return null;
    return ApplicationMapper.toDomain(prismaApplication);
  }

  async findAll(
    params?: PaginationParams,
  ): Promise<PaginatedResult<Application>> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [prismaApplications, total] = await Promise.all([
      this.prisma.application.findMany({
        skip,
        take: limit,
        orderBy: params?.sortBy
          ? { [params.sortBy]: params.sortOrder ?? 'asc' }
          : undefined,
      }),
      this.prisma.application.count(),
    ]);

    return {
      data: ApplicationMapper.toDomainArray(prismaApplications),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(dto: CreateApplicationDto): Promise<Application> {
    try {
      const validated = validateCreateApplicationDto(dto);

      const prismaApplication = await this.prisma.application.create({
        data: {
          scholarshipId: validated.scholarshipId,
          applicantId: validated.applicantId,
          coverLetter: validated.coverLetter,
          additionalInfo: validated.additionalInfo as never,
        },
      });
      return ApplicationMapper.toDomain(prismaApplication);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(
          `Validation failed: ${error.issues.map((e) => e.message).join(', ')}`,
        );
      }
      throw new Error(`Failed to create application: ${error}`);
    }
  }

  async update(id: string, dto: UpdateApplicationDto): Promise<Application> {
    try {
      const validated = validateUpdateApplicationDto(dto);

      const prismaApplication = await this.prisma.application.update({
        where: { id },
        data: {
          coverLetter: validated.coverLetter,
          additionalInfo: validated.additionalInfo as never,
          status: validated.status,
        },
      });
      return ApplicationMapper.toDomain(prismaApplication);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(
          `Validation failed: ${error.issues.map((e) => e.message).join(', ')}`,
        );
      }
      throw new Error(`Failed to update application: ${error}`);
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.application.delete({
      where: { id },
    });
  }

  count(params?: Prisma.ApplicationCountArgs): Promise<number> {
    return this.prisma.application.count(params);
  }

  async hasApplied(studentId: string, scholarshipId: string): Promise<boolean> {
    const count = await this.prisma.application.count({
      where: {
        applicantId: studentId,
        scholarshipId,
      },
    });
    return count > 0;
  }

  countByScholarship(scholarshipId: string): Promise<number> {
    return this.prisma.application.count({
      where: { scholarshipId },
    });
  }
}
