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
import { UserRole } from '../../../shared/constants';
import {
  AddCategoryCommand,
  RemoveCategoryCommand,
} from '../../../core/application/commands/scholarship-category';
import { GetAllCategoriesQuery } from '../../../core/application/queries/scholarship-category';
import { AddCategoryDto } from '../dtos/scholarship-category';

@Controller('scholarships')
@ApiTags('Scholarship Categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ScholarshipCategoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get all unique category names' })
  @ApiResponse({
    status: 200,
    description: 'List of unique category names',
  })
  async getAllCategories(): Promise<string[]> {
    const query = new GetAllCategoriesQuery();
    return await this.queryBus.execute(query);
  }

  @Post(':id/categories')
  @Roles(UserRole.ADMIN, UserRole.SPONSOR)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Add category to scholarship (Admin/Sponsor only)',
  })
  @ApiParam({ name: 'id', description: 'Scholarship ID' })
  @ApiResponse({
    status: 201,
    description: 'Category added successfully',
  })
  @ApiResponse({ status: 404, description: 'Scholarship not found' })
  @ApiResponse({ status: 409, description: 'Category already exists' })
  async addCategory(
    @Param('id') scholarshipId: string,
    @Body() dto: AddCategoryDto,
  ): Promise<any> {
    const command = new AddCategoryCommand(scholarshipId, dto.name);
    return await this.commandBus.execute(command);
  }

  @Delete(':id/categories/:categoryId')
  @Roles(UserRole.ADMIN, UserRole.SPONSOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove category from scholarship (Admin/Sponsor only)',
  })
  @ApiParam({ name: 'id', description: 'Scholarship ID' })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiResponse({
    status: 204,
    description: 'Category removed successfully',
  })
  async removeCategory(
    @Param('id') scholarshipId: string,
    @Param('categoryId') categoryId: string,
  ): Promise<void> {
    const command = new RemoveCategoryCommand(scholarshipId, categoryId);
    await this.commandBus.execute(command);
  }
}
