import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProfileController } from '../controllers/profile.controller';
import { RepositoriesModule } from '../../../infras/repositories';
import { SupabaseModule } from '../../../infras/storage/supabase/supabase.module';

import {
  UpdateProfileCommandHandler,
  UpdateAvatarCommandHandler,
} from '../../../core/application/commands/profile';

import { GetProfileQueryHandler } from '../../../core/application/queries/profile';

const CommandHandlers = [
  UpdateProfileCommandHandler,
  UpdateAvatarCommandHandler,
];

const QueryHandlers = [GetProfileQueryHandler];

@Module({
  imports: [CqrsModule, RepositoriesModule, SupabaseModule],
  controllers: [ProfileController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class ProfileModule {}
