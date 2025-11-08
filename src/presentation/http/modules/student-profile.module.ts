import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { StudentProfileController } from '../../../presentation/http/controllers/student-profile.controller';
import { RepositoriesModule } from '../../../infras/repositories/repositories.module';
import {
  CreateStudentProfileCommandHandler,
  UpdateStudentProfileCommandHandler,
} from '../../../core/application/commands/student-profile';
import {
  GetOwnStudentProfileQueryHandler,
  GetPublicStudentProfileQueryHandler,
} from '../../../core/application/queries/student-profile';

const commandHandlers = [
  CreateStudentProfileCommandHandler,
  UpdateStudentProfileCommandHandler,
];

const queryHandlers = [
  GetOwnStudentProfileQueryHandler,
  GetPublicStudentProfileQueryHandler,
];

@Module({
  imports: [CqrsModule, RepositoriesModule],
  controllers: [StudentProfileController],
  providers: [...commandHandlers, ...queryHandlers],
})
export class StudentProfileModule {}
