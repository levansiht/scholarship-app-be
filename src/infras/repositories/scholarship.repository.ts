import { Injectable } from '@nestjs/common';
import { Scholarship, ScholarshipStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma/prisma.service';
import { IRepositoryScholarship } from '../../core/domain/interfaces/repositories';

/**
 * ScholarshipRepository - Data access layer for Scholarship entity
 *
 * Responsibilities:
 * - Implement repository interface from domain layer
 * - Handle all database operations via Prisma
 * - Provide type-safe data access methods
 * - Encapsulate Prisma-specific logic
 */
@Injectable()
export class ScholarshipRepository implements IRepositoryScholarship {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find scholarship by ID
   */
  findById(id: string): Promise<Scholarship | null> {
    return this.prisma.scholarship.findUnique({
      where: { id },
    });
  }

  /**
   * Find all scholarships created by a sponsor
   */
  findBySponsor(sponsorId: string): Promise<Scholarship[]> {
    return this.prisma.scholarship.findMany({
      where: { createdBy: sponsorId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find all active scholarships (OPEN status and not expired)
   */
  findActive(): Promise<Scholarship[]> {
    const now = new Date();
    return this.prisma.scholarship.findMany({
      where: {
        status: ScholarshipStatus.OPEN,
        deadline: {
          gte: now,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find scholarships by status
   */
  findByStatus(status: string): Promise<Scholarship[]> {
    return this.prisma.scholarship.findMany({
      where: { status: status as ScholarshipStatus },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Search scholarships by keyword in title or description
   * Only returns OPEN scholarships
   */
  search(keyword: string): Promise<Scholarship[]> {
    return this.prisma.scholarship.findMany({
      where: {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
        ],
        status: ScholarshipStatus.OPEN,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find scholarships by category
   */
  findByCategory(categoryId: string): Promise<Scholarship[]> {
    return this.prisma.scholarship.findMany({
      where: {
        categories: {
          some: {
            name: categoryId,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find scholarship with all relations
   * Includes: categories, requirements, eligibility, documents
   */
  findWithRelations(id: string): Promise<Scholarship | null> {
    return this.prisma.scholarship.findUnique({
      where: { id },
      include: {
        categories: true,
        requirements: true,
        eligibility: true,
        documents: true,
      },
    });
  }

  /**
   * Find all scholarships with optional filters
   * @param params - Prisma query arguments (where, include, orderBy, etc.)
   */
  findAll(params?: Prisma.ScholarshipFindManyArgs): Promise<Scholarship[]> {
    return this.prisma.scholarship.findMany(params);
  }

  /**
   * Create new scholarship
   * @param data - Scholarship creation data with type safety
   */
  create(data: Prisma.ScholarshipCreateInput): Promise<Scholarship> {
    return this.prisma.scholarship.create({
      data,
    });
  }

  /**
   * Update existing scholarship
   * @param data - Partial scholarship data for update
   */
  update(
    id: string,
    data: Prisma.ScholarshipUpdateInput,
  ): Promise<Scholarship> {
    return this.prisma.scholarship.update({
      where: { id },
      data,
    });
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
   * Publish scholarship (set status to OPEN)
   */
  async publish(id: string): Promise<void> {
    await this.prisma.scholarship.update({
      where: { id },
      data: { status: ScholarshipStatus.OPEN },
    });
  }

  /**
   * Close scholarship (set status to CLOSED)
   */
  async close(id: string): Promise<void> {
    await this.prisma.scholarship.update({
      where: { id },
      data: { status: ScholarshipStatus.CLOSED },
    });
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
