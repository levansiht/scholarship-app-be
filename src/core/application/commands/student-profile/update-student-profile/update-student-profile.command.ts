import { BaseCommand } from '../../../common';
import { UpdateStudentProfileData } from '../../../../domain/interfaces/repositories';

export class UpdateStudentProfileCommand extends BaseCommand {
  constructor(
    public readonly userId: string,
    public readonly data: UpdateStudentProfileData,
  ) {
    super();
  }
}
