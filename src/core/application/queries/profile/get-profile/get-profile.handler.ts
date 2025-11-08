import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { BaseQueryHandler } from '../../../common';
import { GetProfileQuery } from './get-profile.query';
import { Profile } from '../../../../domain/entities';
import {
  IProfileRepository,
  PROFILE_REPOSITORY,
} from '../../../../domain/interfaces/repositories';

@Injectable()
@QueryHandler(GetProfileQuery)
export class GetProfileQueryHandler extends BaseQueryHandler<
  GetProfileQuery,
  Profile
> {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: IProfileRepository,
  ) {
    super();
  }

  async query(query: GetProfileQuery): Promise<Profile> {
    const { userId } = query;

    const profile = await this.profileRepository.findByUserId(userId);

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }
}
