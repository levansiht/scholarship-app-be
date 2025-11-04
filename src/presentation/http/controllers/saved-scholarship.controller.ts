import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../infras/auth';
import { CurrentUser } from '../../../infras/auth/current-user.decorator';
import { UserRole } from '../../../shared/constants';
import {
  SaveScholarshipCommand,
  UnsaveScholarshipCommand,
} from '../../../core/application/commands/saved-scholarship';
import {
  GetSavedScholarshipsQuery,
  CheckScholarshipSavedQuery,
} from '../../../core/application/queries/saved-scholarship';
import { SaveScholarshipDto } from '../dtos/saved-scholarship';

@Controller('scholarships')
@ApiTags('Saved Scholarships')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class SavedScholarshipController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post(':id/save')
  @Roles(UserRole.STUDENT)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Save a scholarship (Student only)' })
  @ApiParam({ name: 'id', description: 'Scholarship ID' })
  @ApiResponse({
    status: 201,
    description: 'Scholarship saved successfully',
  })
  @ApiResponse({ status: 404, description: 'Scholarship not found' })
  @ApiResponse({ status: 409, description: 'Scholarship already saved' })
  async saveScholarship(
    @Param('id') scholarshipId: string,
    @Body() dto: SaveScholarshipDto,
    @CurrentUser() user: { id: string },
  ): Promise<any> {
    const command = new SaveScholarshipCommand(
      user.id,
      scholarshipId,
      dto.note,
    );
    return await this.commandBus.execute(command);
  }

  @Delete(':id/save')
  @Roles(UserRole.STUDENT)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unsave a scholarship (Student only)' })
  @ApiParam({ name: 'id', description: 'Scholarship ID' })
  @ApiResponse({
    status: 204,
    description: 'Scholarship unsaved successfully',
  })
  async unsaveScholarship(
    @Param('id') scholarshipId: string,
    @CurrentUser() user: { id: string },
  ): Promise<void> {
    const command = new UnsaveScholarshipCommand(user.id, scholarshipId);
    await this.commandBus.execute(command);
  }

  @Get('saved')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Get all saved scholarships (Student only)' })
  @ApiResponse({
    status: 200,
    description: 'List of saved scholarships',
  })
  async getSavedScholarships(
    @CurrentUser() user: { id: string },
  ): Promise<any> {
    const query = new GetSavedScholarshipsQuery(user.id);
    return await this.queryBus.execute(query);
  }

  @Get(':id/is-saved')
  @Roles(UserRole.STUDENT)
  @ApiOperation({
    summary: 'Check if scholarship is saved (Student only)',
  })
  @ApiParam({ name: 'id', description: 'Scholarship ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns { isSaved: boolean }',
  })
  async checkScholarshipSaved(
    @Param('id') scholarshipId: string,
    @CurrentUser() user: { id: string },
  ): Promise<{ isSaved: boolean }> {
    const query = new CheckScholarshipSavedQuery(user.id, scholarshipId);
    return await this.queryBus.execute(query);
  }
}
