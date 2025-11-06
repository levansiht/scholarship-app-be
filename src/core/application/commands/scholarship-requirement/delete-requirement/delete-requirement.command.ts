import { BaseCommand } from '../../../common';

export class DeleteRequirementCommand extends BaseCommand {
  constructor(public readonly requirementId: string) {
    super();
  }
}
