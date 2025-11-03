import { SavedScholarship as PrismaSavedScholarship } from '@prisma/client';
import { SavedScholarship } from '../entities';

export class SavedScholarshipMapper {
  static toDomain(prismaModel: PrismaSavedScholarship): SavedScholarship {
    return new SavedScholarship({
      id: prismaModel.id,
      userId: prismaModel.userId,
      scholarshipId: prismaModel.scholarshipId,
      note: prismaModel.note || undefined,
      createdAt: prismaModel.createdAt,
    });
  }

  static toPrisma(
    domain: SavedScholarship,
  ): Omit<PrismaSavedScholarship, 'createdAt'> {
    return {
      id: domain.id,
      userId: domain.userId,
      scholarshipId: domain.scholarshipId,
      note: domain.note || null,
    };
  }
}
