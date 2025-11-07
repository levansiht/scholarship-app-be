import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  JwtAuthGuard,
  CurrentUser,
  Roles,
  RolesGuard,
} from '../../../infras/auth';
import {
  CreateStudentProfileDto,
  UpdateStudentProfileDto,
} from '../dtos/student-profile.dto';
import {
  CreateStudentProfileCommand,
  UpdateStudentProfileCommand,
} from '../../../core/application/commands/student-profile';
import {
  GetOwnStudentProfileQuery,
  GetPublicStudentProfileQuery,
} from '../../../core/application/queries/student-profile';
import { UserRole } from '../../../shared';
import { StudentProfile } from '../../../core/domain/entities';

@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentProfileController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('profile')
  @Roles(UserRole.STUDENT)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  async createProfile(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateStudentProfileDto,
  ): Promise<StudentProfile> {
    const command = new CreateStudentProfileCommand({
      userId,
      studentId: dto.studentId,
      university: dto.university,
      major: dto.major,
      yearOfStudy: dto.yearOfStudy,
      gpa: dto.gpa,
      expectedGradYear: dto.expectedGradYear,
      skills: dto.skills,
      interests: dto.interests,
      achievements: dto.achievements,
    });

    return this.commandBus.execute(command);
  }

  @Get('me/profile')
  @Roles(UserRole.STUDENT)
  @UseGuards(RolesGuard)
  async getOwnProfile(
    @CurrentUser('userId') userId: string,
  ): Promise<StudentProfile> {
    const query = new GetOwnStudentProfileQuery(userId);
    return this.queryBus.execute(query);
  }

  @Patch('me/profile')
  @Roles(UserRole.STUDENT)
  @UseGuards(RolesGuard)
  async updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateStudentProfileDto,
  ): Promise<StudentProfile> {
    const command = new UpdateStudentProfileCommand(userId, dto);
    return this.commandBus.execute(command);
  }

  @Get(':userId/profile')
  async getPublicProfile(
    @Param('userId') userId: string,
  ): Promise<StudentProfile> {
    const query = new GetPublicStudentProfileQuery(userId);
    return this.queryBus.execute(query);
  }
}
