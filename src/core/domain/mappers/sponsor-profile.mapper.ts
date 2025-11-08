import { SponsorProfile as PrismaSponsorProfile, Prisma } from '@prisma/client';
import {
  SponsorProfile,
  SponsorProfileProps,
} from '../entities/sponsor-profile.entity';

export class SponsorProfileMapper {
  static toDomain(prisma: PrismaSponsorProfile): SponsorProfile | null {
    if (!prisma) return null;

    const contactEmail: unknown = prisma.contactEmail;
    if (contactEmail == null || typeof contactEmail !== 'string') {
      throw new Error('Invalid contactEmail on SponsorProfile record');
    }

    const props: SponsorProfileProps = {
      id: prisma.id,
      userId: prisma.userId,
      organizationName: prisma.organizationName,
      organizationType: prisma.organizationType,
      website: prisma.website ?? undefined,
      description: prisma.description,
      logo: prisma.logo ?? undefined,
      taxId: prisma.taxId ?? undefined,
      contactEmail: contactEmail,
      verified: prisma.verified,
      verifiedAt: prisma.verifiedAt ?? undefined,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    };

    return SponsorProfile.create(props);
  }

  static toPrisma(domain: SponsorProfile): Prisma.SponsorProfileCreateInput {
    return {
      id: domain.id,
      organizationName: domain.organizationName,
      organizationType: domain.organizationType,
      website: domain.website ?? null,
      description: domain.description,
      logo: domain.logo ?? null,
      taxId: domain.taxId ?? null,
      contactEmail: domain.contactEmail,
      verified: domain.verified,
      verifiedAt: domain.verifiedAt ?? null,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      user: {
        connect: { id: domain.userId },
      },
    };
  }
}
