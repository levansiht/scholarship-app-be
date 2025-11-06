import { BaseCommand } from '../../../common';

export interface CreateSponsorProfileData {
  userId: string;
  organizationName: string;
  organizationType: string;
  website?: string;
  description: string;
  logo?: string;
  taxId?: string;
  contactEmail: string;
}

export class CreateSponsorProfileCommand extends BaseCommand {
  constructor(public readonly data: CreateSponsorProfileData) {
    super();
  }
}
