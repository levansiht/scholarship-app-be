import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { ISavedScholarshipRepository } from '../../core/domain/interfaces/repositories';
import { SavedScholarship } from '../../core/domain/entities';
import { SavedScholarshipMapper } from '../../core/domain/mappers';

@Injectable()
export class SavedScholarshipRepository implements ISavedScholarshipRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    userId: string,
    scholarshipId: string,
    note?: string,
  ): Promise<SavedScholarship> {
    const saved = await this.prisma.savedScholarship.create({
      data: {
        userId,
        scholarshipId,
        note: note || null,
      },
    });

    return SavedScholarshipMapper.toDomain(saved);
  }

  async unsave(userId: string, scholarshipId: string): Promise<void> {
    await this.prisma.savedScholarship.deleteMany({
      where: {
        userId,
        scholarshipId,
      },
    });
  }

  async findByUserId(userId: string): Promise<SavedScholarship[]> {
    const savedScholarships = await this.prisma.savedScholarship.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return savedScholarships.map((s) => SavedScholarshipMapper.toDomain(s));
  }

  async isSaved(userId: string, scholarshipId: string): Promise<boolean> {
    const count = await this.prisma.savedScholarship.count({
      where: {
        userId,
        scholarshipId,
      },
    });

    return count > 0;
  }

  async findById(id: string): Promise<SavedScholarship | null> {
    const saved = await this.prisma.savedScholarship.findUnique({
      where: { id },
    });

    if (!saved) return null;

    return SavedScholarshipMapper.toDomain(saved);
  }
}
