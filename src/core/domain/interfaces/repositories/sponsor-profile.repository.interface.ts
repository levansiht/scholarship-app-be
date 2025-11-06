import { SponsorProfile } from '../../entities/sponsor-profile.entity';

export interface CreateSponsorProfileData {
  userId: string;
  organizationName: string;
  organizationType: string;
  website?: string;
  description: string;
  logo?: string;
  taxId?: string;
  contactEmail: string;
}

export interface UpdateSponsorProfileData {
  organizationName?: string;
  organizationType?: string;
  website?: string;
  description?: string;
  logo?: string;
  taxId?: string;
  contactEmail?: string;
}

export interface ISponsorProfileRepository {
  create(data: CreateSponsorProfileData): Promise<SponsorProfile>;
  findByUserId(userId: string): Promise<SponsorProfile | null>;
  findById(id: string): Promise<SponsorProfile | null>;
  update(
    userId: string,
    data: UpdateSponsorProfileData,
  ): Promise<SponsorProfile>;
  verify(userId: string): Promise<SponsorProfile>;
  exists(userId: string): Promise<boolean>;
}

export const SPONSOR_PROFILE_REPOSITORY = 'SPONSOR_PROFILE_REPOSITORY';
