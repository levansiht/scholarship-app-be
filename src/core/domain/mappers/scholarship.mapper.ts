import { Scholarship as PrismaScholarship } from '@prisma/client';
import { Scholarship, ScholarshipStatus } from '../entities';
import { Money } from '../value-objects';

export class ScholarshipMapper {
  static toDomain(prismaScholarship: PrismaScholarship): Scholarship {
    return Scholarship.create({
      id: prismaScholarship.id,
      createdBy: prismaScholarship.createdBy,
      title: prismaScholarship.title,
      slug: prismaScholarship.slug,
      description: prismaScholarship.description,
      amount: Money.create(
        Number(prismaScholarship.amount),
        prismaScholarship.currency as 'VND' | 'USD',
      ),
      numberOfSlots: prismaScholarship.numberOfSlots,
      availableSlots: prismaScholarship.availableSlots,
      deadline: prismaScholarship.deadline,
      startDate: prismaScholarship.startDate,
      endDate: prismaScholarship.endDate,
      status: prismaScholarship.status as ScholarshipStatus,
      featured: prismaScholarship.featured,
      views: prismaScholarship.views,
      isRecurring: prismaScholarship.isRecurring,
      thumbnailUrl: prismaScholarship.thumbnailUrl,
      tags: prismaScholarship.tags,
      publishedAt: prismaScholarship.publishedAt,
      createdAt: prismaScholarship.createdAt,
      updatedAt: prismaScholarship.updatedAt,
    });
  }

  static toPrisma(scholarship: Scholarship): PrismaScholarship {
    return {
      id: scholarship.id,
      createdBy: scholarship.createdBy,
      title: scholarship.title,
      slug: scholarship.slug,
      description: scholarship.description,
      amount: scholarship.amount.amount as never,
      currency: scholarship.amount.currency,
      numberOfSlots: scholarship.numberOfSlots,
      availableSlots: scholarship.availableSlots,
      deadline: scholarship.deadline,
      startDate: scholarship.startDate,
      endDate: scholarship.endDate,
      status: scholarship.status,
      featured: scholarship.featured,
      views: scholarship.views,
      isRecurring: scholarship.isRecurring,
      thumbnailUrl: scholarship.thumbnailUrl,
      tags: scholarship.tags,
      searchVector: null,
      publishedAt: scholarship.publishedAt,
      createdAt: scholarship.createdAt,
      updatedAt: scholarship.updatedAt,
    };
  }

  static toDomainArray(prismaScholarships: PrismaScholarship[]): Scholarship[] {
    return prismaScholarships.map((scholarship) => this.toDomain(scholarship));
  }
}
