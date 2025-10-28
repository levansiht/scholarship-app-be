import { Application as PrismaApplication } from '@prisma/client';
import { Application, ApplicationStatus } from '../entities';

export class ApplicationMapper {
  static toDomain(prismaApplication: PrismaApplication): Application {
    return Application.create({
      id: prismaApplication.id,
      scholarshipId: prismaApplication.scholarshipId,
      applicantId: prismaApplication.applicantId,
      status: prismaApplication.status as ApplicationStatus,
      coverLetter: prismaApplication.coverLetter,
      additionalInfo: prismaApplication.additionalInfo as Record<
        string,
        unknown
      > | null,
      submittedAt: prismaApplication.submittedAt,
      reviewedAt: prismaApplication.reviewedAt,
      decidedAt: prismaApplication.decidedAt,
      createdAt: prismaApplication.createdAt,
      updatedAt: prismaApplication.updatedAt,
    });
  }

  static toPrisma(application: Application): PrismaApplication {
    return {
      id: application.id,
      scholarshipId: application.scholarshipId,
      applicantId: application.applicantId,
      status: application.status,
      coverLetter: application.coverLetter,
      additionalInfo: application.additionalInfo as never,
      submittedAt: application.submittedAt,
      reviewedAt: application.reviewedAt,
      decidedAt: application.decidedAt,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
    };
  }

  static toDomainArray(prismaApplications: PrismaApplication[]): Application[] {
    return prismaApplications.map((app) => this.toDomain(app));
  }
}
