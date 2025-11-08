import { BaseCommand } from '../../../common';

export interface UpdateSponsorProfileData {
  organizationName?: string;
  organizationType?: string;
  website?: string;
  description?: string;
  logo?: string;
  taxId?: string;
}

export class UpdateSponsorProfileCommand extends BaseCommand {
  constructor(
    public readonly userId: string,
    public readonly data: UpdateSponsorProfileData,
  ) {
    super();
  }
}
