import { BaseCommand } from '../../../common';

export interface UpdateRequirementData {
  title?: string;
  description?: string;
  isRequired?: boolean;
  displayOrder?: number;
}

export class UpdateRequirementCommand extends BaseCommand {
  constructor(
    public readonly requirementId: string,
    public readonly data: UpdateRequirementData,
  ) {
    super();
  }
}
