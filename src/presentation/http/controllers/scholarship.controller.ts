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
import { JwtAuthGuard, RolesGuard, Roles } from '../../../infras/auth';
import { CurrentUser } from '../../../infras/auth/current-user.decorator';
import { User } from '../../../core/domain/entities';
import { UserRole } from '../../../shared/constants';
import { CreateScholarshipCommand } from '../../../core/application/commands/scholarship/create-scholarship/create-scholarship.command';
import { UpdateScholarshipCommand } from '../../../core/application/commands/scholarship/update-scholarship/update-scholarship.command';
import { PublishScholarshipCommand } from '../../../core/application/commands/scholarship/publish-scholarship/publish-scholarship.command';
import { CloseScholarshipCommand } from '../../../core/application/commands/scholarship/close-scholarship/close-scholarship.command';
import { GetScholarshipByIdQuery } from '../../../core/application/queries/scholarship/get-scholarship-by-id/get-scholarship-by-id.query';
import { ListScholarshipsQuery } from '../../../core/application/queries/scholarship/list-scholarships/list-scholarships.query';
import { SearchScholarshipsQuery } from '../../../core/application/queries/scholarship/search-scholarships/search-scholarships.query';
import { CreateScholarshipHttpDto } from '../dtos/create-scholarship-http.dto';
import { UpdateScholarshipHttpDto } from '../dtos/update-scholarship-http.dto';
import { SearchScholarshipsHttpDto } from '../dtos/search-scholarships-http.dto';
import { ScholarshipStatus, Currency } from '../../../shared/constants/enums';
import { Scholarship } from '../../../core/domain/entities/scholarship.entity';
import type { PaginatedResult } from '../../../core/domain/interfaces/repositories/base.repository.interface';

@Controller('scholarships')
@ApiTags('Scholarships')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ScholarshipController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SPONSOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: '[Admin/Sponsor] Create a new scholarship' })
  @ApiBody({ type: CreateScholarshipHttpDto })
  @ApiResponse({
    status: 201,
    description: 'Scholarship created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Sponsor role required',
  })
  async createScholarship(
    @Body() dto: CreateScholarshipHttpDto,
    @CurrentUser() user: User,
  ): Promise<Scholarship> {
    const createdBy = user.id;

    const command = new CreateScholarshipCommand({
      createdBy,
      title: dto.title,
      slug: dto.title.toLowerCase().replace(/\s+/g, '-'),
      description: dto.description,
      amount: dto.amount,
      currency: Currency.VND,
      numberOfSlots: dto.numberOfSlots,
      deadline: new Date(dto.deadline),
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      tags: dto.tags,
      thumbnailUrl: dto.thumbnailUrl,
    });
    return await this.commandBus.execute(command);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search scholarships with filters' })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'minAmount', required: false })
  @ApiQuery({ name: 'maxAmount', required: false })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['DRAFT', 'PUBLISHED', 'CLOSED'],
  })
  @ApiResponse({
    status: 200,
    description: 'Search results',
  })
  async searchScholarships(
    @Query() dto: SearchScholarshipsHttpDto,
  ): Promise<Scholarship[]> {
    const keyword = dto.keyword || '';
    const query = new SearchScholarshipsQuery(keyword);
    return await this.queryBus.execute(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get scholarship by ID' })
  @ApiParam({ name: 'id', description: 'Scholarship UUID' })
  @ApiResponse({
    status: 200,
    description: 'Scholarship found',
  })
  @ApiResponse({ status: 404, description: 'Scholarship not found' })
  async getScholarshipById(@Param('id') id: string): Promise<Scholarship> {
    const query = new GetScholarshipByIdQuery(id);
    return await this.queryBus.execute(query);
  }

  @Get()
  @ApiOperation({ summary: 'List scholarships with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of scholarships',
  })
  async listScholarships(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<PaginatedResult<Scholarship>> {
    const query = new ListScholarshipsQuery({
      page: Number(page),
      limit: Number(limit),
    });
    return await this.queryBus.execute(query);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SPONSOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: '[Admin/Sponsor] Update scholarship details (Sponsor: own only)',
  })
  @ApiParam({ name: 'id', description: 'Scholarship UUID' })
  @ApiBody({ type: UpdateScholarshipHttpDto })
  @ApiResponse({
    status: 200,
    description: 'Scholarship updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Scholarship not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Sponsor role required or not owner',
  })
  async updateScholarship(
    @Param('id') id: string,
    @Body() dto: UpdateScholarshipHttpDto,
    @CurrentUser() user: User,
  ): Promise<Scholarship> {
    const command = new UpdateScholarshipCommand(
      id,
      {
        title: dto.title,
        description: dto.description,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
        numberOfSlots: dto.numberOfSlots,
        status: dto.status as ScholarshipStatus,
      },
      user.id,
      user.role,
    );
    return await this.commandBus.execute(command);
  }

  @Patch(':id/publish')
  @Roles(UserRole.ADMIN, UserRole.SPONSOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: '[Admin/Sponsor] Publish a scholarship (Sponsor: own only)',
  })
  @ApiParam({ name: 'id', description: 'Scholarship UUID' })
  @ApiResponse({
    status: 200,
    description: 'Scholarship published successfully',
  })
  @ApiResponse({ status: 404, description: 'Scholarship not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Sponsor role required or not owner',
  })
  async publishScholarship(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Scholarship> {
    const command = new PublishScholarshipCommand(id, user.id, user.role);
    return await this.commandBus.execute(command);
  }

  @Patch(':id/close')
  @Roles(UserRole.ADMIN, UserRole.SPONSOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: '[Admin/Sponsor] Close a scholarship (Sponsor: own only)',
  })
  @ApiParam({ name: 'id', description: 'Scholarship UUID' })
  @ApiResponse({
    status: 200,
    description: 'Scholarship closed successfully',
  })
  @ApiResponse({ status: 404, description: 'Scholarship not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin/Sponsor role required or not owner',
  })
  async closeScholarship(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Scholarship> {
    const command = new CloseScholarshipCommand(id, user.id, user.role);
    return await this.commandBus.execute(command);
  }
}
