import { ScholarshipCategory as PrismaScholarshipCategory } from '@prisma/client';
import { ScholarshipCategory } from '../entities';

export class ScholarshipCategoryMapper {
  static toDomain(prismaModel: PrismaScholarshipCategory): ScholarshipCategory {
    return new ScholarshipCategory({
      id: prismaModel.id,
      scholarshipId: prismaModel.scholarshipId,
      name: prismaModel.name,
      createdAt: prismaModel.createdAt,
    });
  }

  static toPrisma(
    domain: ScholarshipCategory,
  ): Omit<PrismaScholarshipCategory, 'createdAt'> {
    return {
      id: domain.id,
      scholarshipId: domain.scholarshipId,
      name: domain.name,
    };
  }
}
