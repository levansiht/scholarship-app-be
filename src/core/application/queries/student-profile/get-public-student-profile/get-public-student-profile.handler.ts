import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetPublicStudentProfileQuery } from './get-public-student-profile.query';
import {
  IStudentProfileRepository,
  STUDENT_PROFILE_REPOSITORY,
} from '../../../../domain/interfaces/repositories';
import { StudentProfile } from '../../../../domain/entities';

@QueryHandler(GetPublicStudentProfileQuery)
export class GetPublicStudentProfileQueryHandler
  implements IQueryHandler<GetPublicStudentProfileQuery>
{
  constructor(
    @Inject(STUDENT_PROFILE_REPOSITORY)
    private readonly studentProfileRepository: IStudentProfileRepository,
  ) {}

  async execute(query: GetPublicStudentProfileQuery): Promise<StudentProfile> {
    const profile = await this.studentProfileRepository.findByUserId(
      query.userId,
    );

    if (!profile) {
      throw new NotFoundException('Student profile not found');
    }

    return profile;
  }
}
