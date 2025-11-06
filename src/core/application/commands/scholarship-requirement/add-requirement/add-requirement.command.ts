import { BaseCommand } from '../../../common';

export interface AddRequirementData {
  scholarshipId: string;
  title: string;
  description: string;
  isRequired?: boolean;
  displayOrder?: number;
}

export class AddRequirementCommand extends BaseCommand {
  constructor(public readonly data: AddRequirementData) {
    super();
  }
}
