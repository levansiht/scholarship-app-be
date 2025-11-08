import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetOwnSponsorProfileQuery } from './get-own-sponsor-profile.query';
import {
  ISponsorProfileRepository,
  SPONSOR_PROFILE_REPOSITORY,
} from '../../../../domain/interfaces/repositories';
import { SponsorProfile } from '../../../../domain/entities';

@QueryHandler(GetOwnSponsorProfileQuery)
export class GetOwnSponsorProfileQueryHandler
  implements IQueryHandler<GetOwnSponsorProfileQuery>
{
  constructor(
    @Inject(SPONSOR_PROFILE_REPOSITORY)
    private readonly sponsorProfileRepository: ISponsorProfileRepository,
  ) {}

  async execute(query: GetOwnSponsorProfileQuery): Promise<SponsorProfile> {
    const profile = await this.sponsorProfileRepository.findByUserId(
      query.userId,
    );

    if (!profile) {
      throw new NotFoundException('Sponsor profile not found');
    }

    return profile;
  }
}
