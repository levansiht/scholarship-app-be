import { Profile } from '../../entities';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  avatar?: string;
  dateOfBirth?: Date;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
}

export interface IProfileRepository {
  findByUserId(userId: string): Promise<Profile | null>;

  create(userId: string, firstName: string, lastName: string): Promise<Profile>;

  update(userId: string, data: UpdateProfileData): Promise<Profile>;

  updateAvatar(userId: string, avatarUrl: string): Promise<Profile>;

  exists(userId: string): Promise<boolean>;
}

export const PROFILE_REPOSITORY = 'PROFILE_REPOSITORY';
