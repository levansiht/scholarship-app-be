import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { IScholarshipCategoryRepository } from '../../core/domain/interfaces/repositories';
import { ScholarshipCategory } from '../../core/domain/entities';
import { ScholarshipCategoryMapper } from '../../core/domain/mappers';

@Injectable()
export class ScholarshipCategoryRepository
  implements IScholarshipCategoryRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(
    scholarshipId: string,
    name: string,
  ): Promise<ScholarshipCategory> {
    const category = await this.prisma.scholarshipCategory.create({
      data: {
        scholarshipId,
        name,
      },
    });

    return ScholarshipCategoryMapper.toDomain(category);
  }

  async delete(scholarshipId: string, categoryId: string): Promise<void> {
    await this.prisma.scholarshipCategory.deleteMany({
      where: {
        id: categoryId,
        scholarshipId,
      },
    });
  }

  async findByScholarshipId(
    scholarshipId: string,
  ): Promise<ScholarshipCategory[]> {
    const categories = await this.prisma.scholarshipCategory.findMany({
      where: { scholarshipId },
      orderBy: { createdAt: 'asc' },
    });

    return categories.map((c) => ScholarshipCategoryMapper.toDomain(c));
  }

  async findAll(): Promise<string[]> {
    const categories = await this.prisma.scholarshipCategory.findMany({
      distinct: ['name'],
      select: { name: true },
      orderBy: { name: 'asc' },
    });

    return categories.map((c) => c.name);
  }

  async exists(scholarshipId: string, name: string): Promise<boolean> {
    const count = await this.prisma.scholarshipCategory.count({
      where: {
        scholarshipId,
        name,
      },
    });

    return count > 0;
  }
}
