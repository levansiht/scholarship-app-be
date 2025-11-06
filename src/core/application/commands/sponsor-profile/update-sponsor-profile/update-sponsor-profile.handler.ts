import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '../../../common';
import { UpdateSponsorProfileCommand } from './update-sponsor-profile.command';
import {
  SPONSOR_PROFILE_REPOSITORY,
  ISponsorProfileRepository,
} from '../../../../domain/interfaces/repositories';
import { SponsorProfile } from '../../../../domain/entities/sponsor-profile.entity';

@CommandHandler(UpdateSponsorProfileCommand)
export class UpdateSponsorProfileCommandHandler extends BaseCommandHandler<
  UpdateSponsorProfileCommand,
  SponsorProfile
> {
  constructor(
    @Inject(SPONSOR_PROFILE_REPOSITORY)
    private readonly sponsorProfileRepository: ISponsorProfileRepository,
  ) {
    super();
  }

  async execute(command: UpdateSponsorProfileCommand): Promise<SponsorProfile> {
    const { userId, data } = command;

    const updated = await this.sponsorProfileRepository.update(userId, data);

    return updated;
  }
}
