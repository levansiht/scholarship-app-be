import { BaseCommand } from '../../../common';

export class AddCategoryCommand extends BaseCommand {
  constructor(
    public readonly scholarshipId: string,
    public readonly name: string,
  ) {
    super();
  }
}
