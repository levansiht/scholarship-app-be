import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SponsorProfileController } from '../../../presentation/http/controllers/sponsor-profile.controller';
import { RepositoriesModule } from '../../../infras/repositories/repositories.module';
import {
  CreateSponsorProfileCommandHandler,
  UpdateSponsorProfileCommandHandler,
  VerifySponsorCommandHandler,
} from '../../../core/application/commands/sponsor-profile';
import {
  GetOwnSponsorProfileQueryHandler,
  GetPublicSponsorProfileQueryHandler,
} from '../../../core/application/queries/sponsor-profile';

const commandHandlers = [
  CreateSponsorProfileCommandHandler,
  UpdateSponsorProfileCommandHandler,
  VerifySponsorCommandHandler,
];

const queryHandlers = [
  GetOwnSponsorProfileQueryHandler,
  GetPublicSponsorProfileQueryHandler,
];

@Module({
  imports: [CqrsModule, RepositoriesModule],
  controllers: [SponsorProfileController],
  providers: [...commandHandlers, ...queryHandlers],
})
export class SponsorProfileModule {}
