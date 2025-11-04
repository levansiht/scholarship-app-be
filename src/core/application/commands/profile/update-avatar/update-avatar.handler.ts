import { CommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { BaseCommandHandler } from '../../../common';
import { UpdateAvatarCommand } from './update-avatar.command';
import {
  PROFILE_REPOSITORY,
  IProfileRepository,
} from '../../../../domain/interfaces/repositories';
import { Profile } from '../../../../domain/entities';

@CommandHandler(UpdateAvatarCommand)
export class UpdateAvatarCommandHandler extends BaseCommandHandler<
  UpdateAvatarCommand,
  Profile
> {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: IProfileRepository,
  ) {
    super();
  }

  async execute(command: UpdateAvatarCommand): Promise<Profile> {
    const { userId, avatarUrl } = command;

    const updatedProfile = await this.profileRepository.updateAvatar(
      userId,
      avatarUrl,
    );

    return updatedProfile;
  }
}
