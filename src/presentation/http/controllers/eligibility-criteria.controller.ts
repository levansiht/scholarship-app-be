import {
  Controller,
  Post,
  Patch,
  Get,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import {
  SetEligibilityCriteriaDto,
  UpdateEligibilityCriteriaDto,
} from '../dtos/eligibility-criteria.dto';
import {
  SetEligibilityCriteriaCommand,
  UpdateEligibilityCriteriaCommand,
} from '../../../core/application/commands/eligibility-criteria';
import { GetEligibilityCriteriaQuery } from '../../../core/application/queries/eligibility-criteria';
import { EligibilityCriteria } from '../../../core/domain/entities';
import { JwtAuthGuard } from '../../../infras/auth/jwt-auth.guard';
import { Roles } from '../../../infras/auth/decorators/roles.decorator';
import { RolesGuard } from '../../../infras/auth/guards/roles.guard';
import { UserRole } from '../../../shared/constants/enums';

@Controller('scholarships/:scholarshipId/eligibility')
export class EligibilityCriteriaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SPONSOR)
  async setCriteria(
    @Param('scholarshipId') scholarshipId: string,
    @Body() dto: SetEligibilityCriteriaDto,
  ): Promise<EligibilityCriteria> {
    return this.commandBus.execute(
      new SetEligibilityCriteriaCommand(
        scholarshipId,
        dto.minGpa,
        dto.maxGpa,
        dto.allowedMajors,
        dto.allowedYearOfStudy,
        dto.minAge,
        dto.maxAge,
        dto.requiredNationality,
        dto.otherRequirements as Prisma.InputJsonValue,
      ),
    );
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SPONSOR)
  async updateCriteria(
    @Param('scholarshipId') scholarshipId: string,
    @Body() dto: UpdateEligibilityCriteriaDto,
  ): Promise<EligibilityCriteria> {
    return this.commandBus.execute(
      new UpdateEligibilityCriteriaCommand(
        scholarshipId,
        dto.minGpa,
        dto.maxGpa,
        dto.allowedMajors,
        dto.allowedYearOfStudy,
        dto.minAge,
        dto.maxAge,
        dto.requiredNationality,
        dto.otherRequirements as Prisma.InputJsonValue,
      ),
    );
  }

  @Get()
  async getCriteria(
    @Param('scholarshipId') scholarshipId: string,
  ): Promise<EligibilityCriteria> {
    return this.queryBus.execute(
      new GetEligibilityCriteriaQuery(scholarshipId),
    );
  }
}
