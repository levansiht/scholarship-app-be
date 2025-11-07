import { EligibilityCriteria as PrismaEligibilityCriteria } from '@prisma/client';
import { EligibilityCriteria } from '../entities';
import { Prisma } from '@prisma/client';

export class EligibilityCriteriaMapper {
  static toDomain(prisma: PrismaEligibilityCriteria): EligibilityCriteria {
    return EligibilityCriteria.create({
      id: prisma.id,
      scholarshipId: prisma.scholarshipId,
      minGpa: prisma.minGPA ? prisma.minGPA.toNumber() : undefined,
      maxGpa: prisma.maxGPA ? prisma.maxGPA.toNumber() : undefined,
      allowedMajors: prisma.allowedMajors ?? undefined,
      allowedYearOfStudy: prisma.allowedYears ?? undefined,
      minAge: prisma.minAge ?? undefined,
      maxAge: prisma.maxAge ?? undefined,
      requiredNationality:
        prisma.nationality && prisma.nationality.length > 0
          ? prisma.nationality[0]
          : undefined,
      otherRequirements: (prisma.otherCriteria as any) ?? undefined,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    });
  }

  static toPrisma(
    domain: EligibilityCriteria,
  ): Prisma.EligibilityCriteriaCreateInput {
    return {
      id: domain.id,
      scholarship: {
        connect: { id: domain.scholarshipId },
      },
      minGPA: domain.minGpa ? new Prisma.Decimal(domain.minGpa) : null,
      maxGPA: domain.maxGpa ? new Prisma.Decimal(domain.maxGpa) : null,
      allowedMajors: domain.allowedMajors ?? [],
      allowedYears: domain.allowedYearOfStudy ?? [],
      minAge: domain.minAge ?? null,
      maxAge: domain.maxAge ?? null,
      nationality: domain.requiredNationality
        ? [domain.requiredNationality]
        : [],
      otherCriteria: domain.otherRequirements ?? Prisma.JsonNull,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  static toUpdatePrisma(
    domain: Partial<EligibilityCriteria>,
  ): Prisma.EligibilityCriteriaUpdateInput {
    const data: Prisma.EligibilityCriteriaUpdateInput = {};

    if (domain.minGpa !== undefined) {
      data.minGPA =
        domain.minGpa !== null ? new Prisma.Decimal(domain.minGpa) : null;
    }
    if (domain.maxGpa !== undefined) {
      data.maxGPA =
        domain.maxGpa !== null ? new Prisma.Decimal(domain.maxGpa) : null;
    }
    if (domain.allowedMajors !== undefined) {
      data.allowedMajors = domain.allowedMajors ?? [];
    }
    if (domain.allowedYearOfStudy !== undefined) {
      data.allowedYears = domain.allowedYearOfStudy ?? [];
    }
    if (domain.minAge !== undefined) {
      data.minAge = domain.minAge;
    }
    if (domain.maxAge !== undefined) {
      data.maxAge = domain.maxAge;
    }
    if (domain.requiredNationality !== undefined) {
      data.nationality = domain.requiredNationality
        ? [domain.requiredNationality]
        : [];
    }
    if (domain.otherRequirements !== undefined) {
      data.otherCriteria = domain.otherRequirements ?? Prisma.JsonNull;
    }

    return data;
  }
}
