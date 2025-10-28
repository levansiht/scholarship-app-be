import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { IRepositoryApplication } from '../../core/domain/interfaces/repositories';
import { Application, ApplicationStatus, Prisma } from '@prisma/client';
@Injectable()
export class ApplicationRepository implements IRepositoryApplication {
  constructor(private readonly prisma: PrismaService) {}
  findById(id: string): Promise<Application | null> {
    return this.prisma.application.findUnique({
      where: { id },
    });
  }

  findByStudent(studentId: string): Promise<Application[]> {
    return this.prisma.application.findMany({
      where: { applicantId: studentId },
      orderBy: { createdAt: 'desc' },
      include: {
        scholarship: true,
      },
    });
  }

  findByScholarship(scholarshipId: string): Promise<Application[]> {
    return this.prisma.application.findMany({
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
  }

  findByStatus(status: string): Promise<Application[]> {
    return this.prisma.application.findMany({
      where: { status: status as ApplicationStatus },
      orderBy: { createdAt: 'desc' },
    });
  }

  findWithRelations(id: string): Promise<Application | null> {
    return this.prisma.application.findUnique({
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
  }
  findAll(params?: Prisma.ApplicationFindManyArgs): Promise<Application[]> {
    return this.prisma.application.findMany(params);
  }
  create(data: Prisma.ApplicationCreateInput): Promise<Application> {
    return this.prisma.application.create({
      data,
    });
  }
  update(
    id: string,
    data: Prisma.ApplicationUpdateInput,
  ): Promise<Application> {
    return this.prisma.application.update({
      where: { id },
      data,
    });
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

  async updateStatus(id: string, status: string): Promise<void> {
    await this.prisma.application.update({
      where: { id },
      data: { status: status as ApplicationStatus },
    });
  }

  async submit(id: string): Promise<void> {
    await this.prisma.application.update({
      where: { id },
      data: {
        status: ApplicationStatus.SUBMITTED,
        submittedAt: new Date(),
      },
    });
  }

  async approve(id: string): Promise<void> {
    await this.prisma.application.update({
      where: { id },
      data: { status: ApplicationStatus.APPROVED },
    });
  }

  async reject(id: string, reason?: string): Promise<void> {
    await this.prisma.application.update({
      where: { id },
      data: {
        status: ApplicationStatus.REJECTED,
        ...(reason && { notes: reason }),
      },
    });
  }

  countByScholarship(scholarshipId: string): Promise<number> {
    return this.prisma.application.count({
      where: { scholarshipId },
    });
  }
}
