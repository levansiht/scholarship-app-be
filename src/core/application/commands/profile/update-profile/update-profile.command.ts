import { BaseCommand } from '../../../common';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
}

export class UpdateProfileCommand extends BaseCommand {
  constructor(
    public readonly userId: string,
    public readonly data: UpdateProfileData,
  ) {
    super();
  }
}
