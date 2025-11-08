import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../infras/auth';
import { UserRole } from '../../../shared/constants';
import {
  AddRequirementCommand,
  UpdateRequirementCommand,
  DeleteRequirementCommand,
} from '../../../core/application/commands/scholarship-requirement';
import { GetRequirementsQuery } from '../../../core/application/queries/scholarship-requirement';
import {
  validateAddRequirementDto,
  validateUpdateRequirementDto,
  type AddRequirementDtoType,
  type UpdateRequirementDtoType,
} from '../../../core/domain/dtos';

@Controller('scholarships/:scholarshipId/requirements')
@ApiTags('Scholarship Requirements')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ScholarshipRequirementController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SPONSOR)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: '[Admin/Sponsor] Add requirement to scholarship',
    description: 'Add a new requirement with display order',
  })
  @ApiParam({ name: 'scholarshipId', description: 'Scholarship UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'description'],
      properties: {
        title: { type: 'string', example: 'Academic Transcript' },
        description: {
          type: 'string',
          example: 'Official academic transcript from your institution',
        },
        isRequired: { type: 'boolean', example: true, default: true },
        displayOrder: { type: 'number', example: 0, default: 0 },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Requirement added successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Sponsor only' })
  @ApiResponse({ status: 404, description: 'Scholarship not found' })
  async addRequirement(
    @Param('scholarshipId') scholarshipId: string,
    @Body() body: unknown,
  ): Promise<any> {
    const dto: AddRequirementDtoType = validateAddRequirementDto(body);

    const command = new AddRequirementCommand({
      scholarshipId,
      ...dto,
    });

    return await this.commandBus.execute(command);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all requirements for a scholarship',
    description: 'Returns list of requirements ordered by displayOrder',
  })
  @ApiParam({ name: 'scholarshipId', description: 'Scholarship UUID' })
  @ApiResponse({
    status: 200,
    description: 'Requirements retrieved successfully',
  })
  async getRequirements(
    @Param('scholarshipId') scholarshipId: string,
  ): Promise<any> {
    const query = new GetRequirementsQuery(scholarshipId);
    return await this.queryBus.execute(query);
  }

  @Patch(':requirementId')
  @Roles(UserRole.ADMIN, UserRole.SPONSOR)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: '[Admin/Sponsor] Update requirement',
    description: 'Update requirement details or display order',
  })
  @ApiParam({ name: 'scholarshipId', description: 'Scholarship UUID' })
  @ApiParam({ name: 'requirementId', description: 'Requirement UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Academic Transcript' },
        description: {
          type: 'string',
          example: 'Updated description',
        },
        isRequired: { type: 'boolean', example: true },
        displayOrder: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Requirement updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Sponsor only' })
  @ApiResponse({ status: 404, description: 'Requirement not found' })
  async updateRequirement(
    @Param('requirementId') requirementId: string,
    @Body() body: unknown,
  ): Promise<any> {
    const dto: UpdateRequirementDtoType = validateUpdateRequirementDto(body);

    const command = new UpdateRequirementCommand(requirementId, dto);

    return await this.commandBus.execute(command);
  }

  @Delete(':requirementId')
  @Roles(UserRole.ADMIN, UserRole.SPONSOR)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: '[Admin/Sponsor] Delete requirement',
    description: 'Remove a requirement from scholarship',
  })
  @ApiParam({ name: 'scholarshipId', description: 'Scholarship UUID' })
  @ApiParam({ name: 'requirementId', description: 'Requirement UUID' })
  @ApiResponse({
    status: 200,
    description: 'Requirement deleted successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Sponsor only' })
  @ApiResponse({ status: 404, description: 'Requirement not found' })
  async deleteRequirement(
    @Param('requirementId') requirementId: string,
  ): Promise<void> {
    const command = new DeleteRequirementCommand(requirementId);
    await this.commandBus.execute(command);
  }
}
