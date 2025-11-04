import { CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { BaseCommandHandler } from '../../../common';
import { UpdateProfileCommand } from './update-profile.command';
import {
  PROFILE_REPOSITORY,
  IProfileRepository,
} from '../../../../domain/interfaces/repositories';
import { Profile } from '../../../../domain/entities';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileCommandHandler extends BaseCommandHandler<
  UpdateProfileCommand,
  Profile
> {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: IProfileRepository,
  ) {
    super();
  }

  async execute(command: UpdateProfileCommand): Promise<Profile> {
    const { userId, data } = command;

    const updatedProfile = await this.profileRepository.update(userId, data);

    return updatedProfile;
  }
}
