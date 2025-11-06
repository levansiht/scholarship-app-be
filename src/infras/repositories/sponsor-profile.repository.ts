import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import {
  ISponsorProfileRepository,
  CreateSponsorProfileData,
  UpdateSponsorProfileData,
} from '../../core/domain/interfaces/repositories/sponsor-profile.repository.interface';
import { SponsorProfile } from '../../core/domain/entities/sponsor-profile.entity';
import { SponsorProfileMapper } from '../../core/domain/mappers/sponsor-profile.mapper';

@Injectable()
export class SponsorProfileRepository implements ISponsorProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSponsorProfileData): Promise<SponsorProfile> {
    // Check if profile already exists
    const existing = await this.prisma.sponsorProfile.findUnique({
      where: { userId: data.userId },
    });

    if (existing) {
      throw new ConflictException(
        'Sponsor profile already exists for this user',
      );
    }

    const profile = await this.prisma.sponsorProfile.create({
      data: {
        userId: data.userId,
        organizationName: data.organizationName,
        organizationType: data.organizationType,
        website: data.website ?? null,
        description: data.description,
        logo: data.logo ?? null,
        taxId: data.taxId ?? null,
        contactEmail: data.contactEmail,
        verified: false,
      },
    });

    const domainProfile = SponsorProfileMapper.toDomain(profile);
    if (!domainProfile) {
      throw new Error('Failed to map sponsor profile to domain');
    }

    return domainProfile;
  }

  async findByUserId(userId: string): Promise<SponsorProfile | null> {
    const profile = await this.prisma.sponsorProfile.findUnique({
      where: { userId },
    });

    return profile ? SponsorProfileMapper.toDomain(profile) : null;
  }

  async findById(id: string): Promise<SponsorProfile | null> {
    const profile = await this.prisma.sponsorProfile.findUnique({
      where: { id },
    });

    return profile ? SponsorProfileMapper.toDomain(profile) : null;
  }

  async update(
    userId: string,
    data: UpdateSponsorProfileData,
  ): Promise<SponsorProfile> {
    const profile = await this.prisma.sponsorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException(
        `Sponsor profile not found for user ${userId}`,
      );
    }

    const updated = await this.prisma.sponsorProfile.update({
      where: { userId },
      data: {
        organizationName: data.organizationName,
        organizationType: data.organizationType,
        website: data.website ?? null,
        description: data.description,
        logo: data.logo ?? null,
        taxId: data.taxId ?? null,
        contactEmail: data.contactEmail,
      },
    });

    const domainProfile = SponsorProfileMapper.toDomain(updated);
    if (!domainProfile) {
      throw new Error('Failed to map updated sponsor profile to domain');
    }

    return domainProfile;
  }

  async verify(userId: string): Promise<SponsorProfile> {
    const profile = await this.prisma.sponsorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException(
        `Sponsor profile not found for user ${userId}`,
      );
    }

    const verified = await this.prisma.sponsorProfile.update({
      where: { userId },
      data: {
        verified: true,
        verifiedAt: new Date(),
      },
    });

    const domainProfile = SponsorProfileMapper.toDomain(verified);
    if (!domainProfile) {
      throw new Error('Failed to map verified sponsor profile to domain');
    }

    return domainProfile;
  }

  async exists(userId: string): Promise<boolean> {
    const count = await this.prisma.sponsorProfile.count({
      where: { userId },
    });

    return count > 0;
  }
}
