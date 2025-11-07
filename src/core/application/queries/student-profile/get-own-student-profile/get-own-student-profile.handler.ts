import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetOwnStudentProfileQuery } from './get-own-student-profile.query';
import {
  IStudentProfileRepository,
  STUDENT_PROFILE_REPOSITORY,
} from '../../../../domain/interfaces/repositories';
import { StudentProfile } from '../../../../domain/entities';

@QueryHandler(GetOwnStudentProfileQuery)
export class GetOwnStudentProfileQueryHandler
  implements IQueryHandler<GetOwnStudentProfileQuery>
{
  constructor(
    @Inject(STUDENT_PROFILE_REPOSITORY)
    private readonly studentProfileRepository: IStudentProfileRepository,
  ) {}

  async execute(query: GetOwnStudentProfileQuery): Promise<StudentProfile> {
    const profile = await this.studentProfileRepository.findByUserId(
      query.userId,
    );

    if (!profile) {
      throw new NotFoundException('Student profile not found');
    }

    return profile;
  }
}
