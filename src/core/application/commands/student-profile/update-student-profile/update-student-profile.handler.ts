import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateStudentProfileCommand } from './update-student-profile.command';
import {
  IStudentProfileRepository,
  STUDENT_PROFILE_REPOSITORY,
} from '../../../../domain/interfaces/repositories';
import { StudentProfile } from '../../../../domain/entities';

@CommandHandler(UpdateStudentProfileCommand)
export class UpdateStudentProfileCommandHandler
  implements ICommandHandler<UpdateStudentProfileCommand>
{
  constructor(
    @Inject(STUDENT_PROFILE_REPOSITORY)
    private readonly studentProfileRepository: IStudentProfileRepository,
  ) {}

  async execute(command: UpdateStudentProfileCommand): Promise<StudentProfile> {
    return await this.studentProfileRepository.update(
      command.userId,
      command.data,
    );
  }
}
