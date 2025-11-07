import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RepositoriesModule } from '../../../infras/repositories/repositories.module';
import { EligibilityCriteriaController } from '../controllers/eligibility-criteria.controller';
import {
  SetEligibilityCriteriaHandler,
  UpdateEligibilityCriteriaHandler,
} from '../../../core/application/commands/eligibility-criteria';
import { GetEligibilityCriteriaHandler } from '../../../core/application/queries/eligibility-criteria';

@Module({
  imports: [CqrsModule, RepositoriesModule],
  controllers: [EligibilityCriteriaController],
  providers: [
    SetEligibilityCriteriaHandler,
    UpdateEligibilityCriteriaHandler,
    GetEligibilityCriteriaHandler,
  ],
})
export class EligibilityCriteriaModule {}
