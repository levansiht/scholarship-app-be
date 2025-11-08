import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { VerifySponsorCommand } from './verify-sponsor.command';
import {
  ISponsorProfileRepository,
  SPONSOR_PROFILE_REPOSITORY,
} from '../../../../domain/interfaces/repositories';
import { SponsorProfile } from '../../../../domain/entities';

@CommandHandler(VerifySponsorCommand)
export class VerifySponsorCommandHandler
  implements ICommandHandler<VerifySponsorCommand>
{
  constructor(
    @Inject(SPONSOR_PROFILE_REPOSITORY)
    private readonly sponsorProfileRepository: ISponsorProfileRepository,
  ) {}

  async execute(command: VerifySponsorCommand): Promise<SponsorProfile> {
    return await this.sponsorProfileRepository.verify(command.userId);
  }
}
