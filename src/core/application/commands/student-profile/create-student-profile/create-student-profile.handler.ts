import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateStudentProfileCommand } from './create-student-profile.command';
import {
  IStudentProfileRepository,
  STUDENT_PROFILE_REPOSITORY,
} from '../../../../domain/interfaces/repositories';
import { StudentProfile } from '../../../../domain/entities';

@CommandHandler(CreateStudentProfileCommand)
export class CreateStudentProfileCommandHandler
  implements ICommandHandler<CreateStudentProfileCommand>
{
  constructor(
    @Inject(STUDENT_PROFILE_REPOSITORY)
    private readonly studentProfileRepository: IStudentProfileRepository,
  ) {}

  async execute(command: CreateStudentProfileCommand): Promise<StudentProfile> {
    return await this.studentProfileRepository.create(command.data);
  }
}
