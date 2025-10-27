import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserRepository } from './user.repository';
import { ScholarshipRepository } from './scholarship.repository';
import { ApplicationRepository } from './application.repository';
import {
  USER_REPOSITORY,
  SCHOLARSHIP_REPOSITORY,
  APPLICATION_REPOSITORY,
} from '../../core/domain/interfaces/repositories';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: SCHOLARSHIP_REPOSITORY,
      useClass: ScholarshipRepository,
    },
    {
      provide: APPLICATION_REPOSITORY,
      useClass: ApplicationRepository,
    },
  ],
  exports: [USER_REPOSITORY, SCHOLARSHIP_REPOSITORY, APPLICATION_REPOSITORY],
})
export class RepositoriesModule {}
