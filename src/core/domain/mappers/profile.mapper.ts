import { Profile as PrismaProfile } from '@prisma/client';
import { Profile, ProfileProps } from '../entities';

export class ProfileMapper {
  static toDomain(prismaModel: PrismaProfile): Profile {
    const props: ProfileProps = {
      id: prismaModel.id,
      userId: prismaModel.userId,
      firstName: prismaModel.firstName,
      lastName: prismaModel.lastName,
      fullName: prismaModel.fullName,
      phoneNumber: prismaModel.phoneNumber || undefined,
      avatar: prismaModel.avatar || undefined,
      dateOfBirth: prismaModel.dateOfBirth || undefined,
      address: prismaModel.address || undefined,
      city: prismaModel.city || undefined,
      country: prismaModel.country,
      bio: prismaModel.bio || undefined,
      createdAt: prismaModel.createdAt,
      updatedAt: prismaModel.updatedAt,
    };

    return new Profile(props);
  }

  static toPrisma(
    domain: Profile,
  ): Omit<PrismaProfile, 'createdAt' | 'updatedAt'> {
    const props = domain.toJSON();
    return {
      id: props.id,
      userId: props.userId,
      firstName: props.firstName,
      lastName: props.lastName,
      fullName: props.fullName,
      phoneNumber: props.phoneNumber || null,
      avatar: props.avatar || null,
      dateOfBirth: props.dateOfBirth || null,
      address: props.address || null,
      city: props.city || null,
      country: props.country,
      bio: props.bio || null,
    };
  }
}
