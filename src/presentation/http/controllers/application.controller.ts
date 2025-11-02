import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../infras/auth/jwt-auth.guard';
import { CurrentUser } from '../../../infras/auth/current-user.decorator';
import { User, ApplicationStatus } from '../../../core/domain/entities';
import { SubmitApplicationCommand } from '../../../core/application/commands/application/submit-application/submit-application.command';
import { ApproveApplicationCommand } from '../../../core/application/commands/application/approve-application/approve-application.command';
import { RejectApplicationCommand } from '../../../core/application/commands/application/reject-application/reject-application.command';
import { WithdrawApplicationCommand } from '../../../core/application/commands/application/withdraw-application/withdraw-application.command';
import { GetApplicationByIdQuery } from '../../../core/application/queries/application/get-application-by-id/get-application-by-id.query';
import { ListApplicationsQuery } from '../../../core/application/queries/application/list-applications/list-applications.query';
import { SubmitApplicationHttpDto } from '../dtos/submit-application-http.dto';
import { ApproveApplicationHttpDto } from '../dtos/approve-application-http.dto';
import { RejectApplicationHttpDto } from '../dtos/reject-application-http.dto';
import { Application } from '../../../core/domain/entities/application.entity';

@ApiTags('Applications')
@Controller('applications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ApplicationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Submit a new application' })
  @ApiBody({ type: SubmitApplicationHttpDto })
  @ApiResponse({
    status: 201,
    description: 'Application submitted successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async submitApplication(
    @Body() dto: SubmitApplicationHttpDto,
    @CurrentUser() user: User,
  ): Promise<Application> {
    const command = new SubmitApplicationCommand({
      scholarshipId: dto.scholarshipId,
      applicantId: user.id,
      additionalInfo: dto.documents,
    });
    return await this.commandBus.execute(command);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get application by ID' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({
    status: 200,
    description: 'Application found',
  })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async getApplicationById(@Param('id') id: string): Promise<Application> {
    const query = new GetApplicationByIdQuery(id);
    return await this.queryBus.execute(query);
  }

  @Get()
  @ApiOperation({
    summary: 'List all applications with filters (Admin only)',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: [
      'DRAFT',
      'SUBMITTED',
      'UNDER_REVIEW',
      'APPROVED',
      'REJECTED',
      'WITHDRAWN',
    ],
  })
  @ApiQuery({ name: 'scholarshipId', required: false })
  @ApiResponse({
    status: 200,
    description: 'List of applications',
  })
  async listApplications(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('scholarshipId') scholarshipId?: string,
  ): Promise<Application[]> {
    const statusEnum: ApplicationStatus | undefined = status
      ? ((ApplicationStatus as unknown as Record<string, ApplicationStatus>)[
          status
        ] ?? undefined)
      : undefined;

    const query = new ListApplicationsQuery(
      page,
      limit,
      statusEnum,
      scholarshipId,
    );
    return await this.queryBus.execute(query);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve an application (Admin only)' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiBody({ type: ApproveApplicationHttpDto })
  @ApiResponse({
    status: 200,
    description: 'Application approved successfully',
  })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async approveApplication(@Param('id') id: string): Promise<Application> {
    const command = new ApproveApplicationCommand(id);
    return await this.commandBus.execute(command);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject an application (Admin only)' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiBody({ type: RejectApplicationHttpDto })
  @ApiResponse({
    status: 200,
    description: 'Application rejected successfully',
  })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async rejectApplication(
    @Param('id') id: string,
    // @Body() _dto: RejectApplicationHttpDto,
  ): Promise<Application> {
    const command = new RejectApplicationCommand(id);
    return await this.commandBus.execute(command);
  }

  @Patch(':id/withdraw')
  @ApiOperation({ summary: 'Withdraw an application (User only)' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({
    status: 200,
    description: 'Application withdrawn successfully',
  })
  @ApiResponse({ status: 404, description: 'Application not found' })
  async withdrawApplication(@Param('id') id: string): Promise<Application> {
    const command = new WithdrawApplicationCommand(id);
    return await this.commandBus.execute(command);
  }
}
