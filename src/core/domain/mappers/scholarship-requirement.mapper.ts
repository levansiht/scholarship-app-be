import {
  ScholarshipRequirement as PrismaScholarshipRequirement,
  Prisma,
} from '@prisma/client';
import {
  ScholarshipRequirement,
  ScholarshipRequirementProps,
} from '../entities/scholarship-requirement.entity';

export class ScholarshipRequirementMapper {
  static toDomain(
    prisma: PrismaScholarshipRequirement,
  ): ScholarshipRequirement | null {
    if (!prisma) return null;

    const props: ScholarshipRequirementProps = {
      id: prisma.id,
      scholarshipId: prisma.scholarshipId,
      title: prisma.title,
      description: prisma.description,
      isRequired: prisma.isRequired,
      displayOrder: prisma.displayOrder,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    };

    return ScholarshipRequirement.create(props);
  }

  static toPrisma(
    domain: ScholarshipRequirement,
  ): Prisma.ScholarshipRequirementCreateInput {
    return {
      id: domain.id,
      title: domain.title,
      description: domain.description,
      isRequired: domain.isRequired,
      displayOrder: domain.displayOrder,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      scholarship: {
        connect: { id: domain.scholarshipId },
      },
    };
  }
}
