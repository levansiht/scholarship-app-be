import { BaseCommand } from '../../../common';

export class RemoveCategoryCommand extends BaseCommand {
  constructor(
    public readonly scholarshipId: string,
    public readonly categoryId: string,
  ) {
    super();
  }
}
