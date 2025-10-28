import { Injectable } from '@nestjs/common';
import { ScholarshipStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma/prisma.service';
import {
  IRepositoryScholarship,
  PaginationParams,
  PaginatedResult,
} from '../../core/domain/interfaces/repositories';
import { Scholarship } from '../../core/domain/entities';
import { ScholarshipMapper } from '../../core/domain/mappers';
import {
  CreateScholarshipDto,
  UpdateScholarshipDto,
} from '../../core/domain/dtos';

@Injectable()
export class ScholarshipRepository implements IRepositoryScholarship {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Scholarship | null> {
    const prismaScholarship = await this.prisma.scholarship.findUnique({
      where: { id },
    });
    if (!prismaScholarship) return null;
    return ScholarshipMapper.toDomain(prismaScholarship);
  }

  async findBySponsor(sponsorId: string): Promise<Scholarship[]> {
    const prismaScholarships = await this.prisma.scholarship.findMany({
      where: { createdBy: sponsorId },
      orderBy: { createdAt: 'desc' },
    });
    return ScholarshipMapper.toDomainArray(prismaScholarships);
  }

  async findActive(): Promise<Scholarship[]> {
    const now = new Date();
    const prismaScholarships = await this.prisma.scholarship.findMany({
      where: {
        status: ScholarshipStatus.OPEN,
        deadline: {
          gte: now,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return ScholarshipMapper.toDomainArray(prismaScholarships);
  }

  async findByStatus(status: string): Promise<Scholarship[]> {
    const prismaScholarships = await this.prisma.scholarship.findMany({
      where: { status: status as ScholarshipStatus },
      orderBy: { createdAt: 'desc' },
    });
    return ScholarshipMapper.toDomainArray(prismaScholarships);
  }

  async search(keyword: string): Promise<Scholarship[]> {
    const prismaScholarships = await this.prisma.scholarship.findMany({
      where: {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
        ],
        status: ScholarshipStatus.OPEN,
      },
      orderBy: { createdAt: 'desc' },
    });
    return ScholarshipMapper.toDomainArray(prismaScholarships);
  }
  async findByCategory(categoryId: string): Promise<Scholarship[]> {
    const prismaScholarships = await this.prisma.scholarship.findMany({
      where: {
        categories: {
          some: {
            name: categoryId,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return ScholarshipMapper.toDomainArray(prismaScholarships);
  }

  async findWithRelations(id: string): Promise<Scholarship | null> {
    const prismaScholarship = await this.prisma.scholarship.findUnique({
      where: { id },
      include: {
        categories: true,
        requirements: true,
        eligibility: true,
        documents: true,
      },
    });
    if (!prismaScholarship) return null;
    return ScholarshipMapper.toDomain(prismaScholarship);
  }

  async findAll(
    params?: PaginationParams,
  ): Promise<PaginatedResult<Scholarship>> {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [prismaScholarships, total] = await Promise.all([
      this.prisma.scholarship.findMany({
        skip,
        take: limit,
        orderBy: params?.sortBy
          ? { [params.sortBy]: params.sortOrder ?? 'asc' }
          : undefined,
      }),
      this.prisma.scholarship.count(),
    ]);

    return {
      data: ScholarshipMapper.toDomainArray(prismaScholarships),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(dto: CreateScholarshipDto): Promise<Scholarship> {
    const prismaScholarship = await this.prisma.scholarship.create({
      data: {
        createdBy: dto.createdBy,
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        amount: dto.amount,
        currency: dto.currency,
        numberOfSlots: dto.numberOfSlots,
        availableSlots: dto.numberOfSlots, // Initially same as numberOfSlots
        deadline: dto.deadline,
        startDate: dto.startDate,
        endDate: dto.endDate,
        tags: dto.tags,
        thumbnailUrl: dto.thumbnailUrl,
      },
    });
    return ScholarshipMapper.toDomain(prismaScholarship);
  }

  /**
   * Update existing scholarship
   * @param dto - Partial scholarship data for update
   */
  async update(id: string, dto: UpdateScholarshipDto): Promise<Scholarship> {
    const prismaScholarship = await this.prisma.scholarship.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        deadline: dto.deadline,
        numberOfSlots: dto.numberOfSlots,
        status: dto.status,
      },
    });
    return ScholarshipMapper.toDomain(prismaScholarship);
  }

  /**
   * Delete scholarship
   */
  async delete(id: string): Promise<void> {
    await this.prisma.scholarship.delete({
      where: { id },
    });
  }

  /**
   * Count scholarships with optional filters
   */
  count(params?: Prisma.ScholarshipCountArgs): Promise<number> {
    return this.prisma.scholarship.count(params);
  }

  /**
   * Check if scholarship belongs to sponsor
   * Returns true if the sponsor created this scholarship
   */
  async belongsToSponsor(
    scholarshipId: string,
    sponsorId: string,
  ): Promise<boolean> {
    const count = await this.prisma.scholarship.count({
      where: {
        id: scholarshipId,
        createdBy: sponsorId,
      },
    });
    return count > 0;
  }
}
