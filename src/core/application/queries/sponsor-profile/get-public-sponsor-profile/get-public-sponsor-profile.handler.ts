import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetPublicSponsorProfileQuery } from './get-public-sponsor-profile.query';
import {
  ISponsorProfileRepository,
  SPONSOR_PROFILE_REPOSITORY,
} from '../../../../domain/interfaces/repositories';
import { SponsorProfile } from '../../../../domain/entities';

@QueryHandler(GetPublicSponsorProfileQuery)
export class GetPublicSponsorProfileQueryHandler
  implements IQueryHandler<GetPublicSponsorProfileQuery>
{
  constructor(
    @Inject(SPONSOR_PROFILE_REPOSITORY)
    private readonly sponsorProfileRepository: ISponsorProfileRepository,
  ) {}

  async execute(query: GetPublicSponsorProfileQuery): Promise<SponsorProfile> {
    const profile = await this.sponsorProfileRepository.findByUserId(
      query.userId,
    );

    if (!profile) {
      throw new NotFoundException('Sponsor profile not found');
    }

    return profile;
  }
}
