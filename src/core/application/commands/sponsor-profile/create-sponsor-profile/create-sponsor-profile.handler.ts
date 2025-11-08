import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '../../../common';
import { CreateSponsorProfileCommand } from './create-sponsor-profile.command';
import {
  SPONSOR_PROFILE_REPOSITORY,
  ISponsorProfileRepository,
} from '../../../../domain/interfaces/repositories';
import { SponsorProfile } from '../../../../domain/entities/sponsor-profile.entity';

@CommandHandler(CreateSponsorProfileCommand)
export class CreateSponsorProfileCommandHandler extends BaseCommandHandler<
  CreateSponsorProfileCommand,
  SponsorProfile
> {
  constructor(
    @Inject(SPONSOR_PROFILE_REPOSITORY)
    private readonly sponsorProfileRepository: ISponsorProfileRepository,
  ) {
    super();
  }

  async execute(command: CreateSponsorProfileCommand): Promise<SponsorProfile> {
    const profile = await this.sponsorProfileRepository.create(command.data);

    return profile;
  }
}
