import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import {
  IProfileRepository,
  UpdateProfileData,
} from '../../core/domain/interfaces/repositories';
import { Profile } from '../../core/domain/entities';
import { ProfileMapper } from '../../core/domain/mappers';

@Injectable()
export class ProfileRepository implements IProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<Profile | null> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) return null;

    return ProfileMapper.toDomain(profile);
  }

  async create(
    userId: string,
    firstName: string,
    lastName: string,
  ): Promise<Profile> {
    const fullName = `${firstName} ${lastName}`;

    const profile = await this.prisma.profile.create({
      data: {
        userId,
        firstName,
        lastName,
        fullName,
        country: 'Vietnam', // Default
      },
    });

    return ProfileMapper.toDomain(profile);
  }

  async update(userId: string, data: UpdateProfileData): Promise<Profile> {
    // Generate fullName if firstName or lastName changed
    const updateData: Record<string, any> = { ...data };

    if (data.firstName || data.lastName) {
      const current = await this.prisma.profile.findUnique({
        where: { userId },
        select: { firstName: true, lastName: true },
      });

      if (!current) {
        throw new NotFoundException('Profile not found');
      }

      const firstName = data.firstName || current.firstName;
      const lastName = data.lastName || current.lastName;
      updateData.fullName = `${firstName} ${lastName}`;
    }

    const profile = await this.prisma.profile.update({
      where: { userId },
      data: updateData,
    });

    return ProfileMapper.toDomain(profile);
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<Profile> {
    const profile = await this.prisma.profile.update({
      where: { userId },
      data: { avatar: avatarUrl },
    });

    return ProfileMapper.toDomain(profile);
  }

  async exists(userId: string): Promise<boolean> {
    const count = await this.prisma.profile.count({
      where: { userId },
    });

    return count > 0;
  }
}
