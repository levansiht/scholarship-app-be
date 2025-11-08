import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard, RolesGuard, Roles } from '../../../infras/auth';
import { UserRole } from '../../../shared/constants';
import {
  UploadDocumentCommand,
  DeleteDocumentCommand,
} from '../../../core/application/commands/scholarship-document';
import {
  GetDocumentsQuery,
  GetDocumentQuery,
} from '../../../core/application/queries/scholarship-document';
import {
  validateUploadDocumentDto,
  type UploadDocumentDtoType,
} from '../../../core/domain/dtos';
import { ScholarshipDocument } from '../../../core/domain/entities/scholarship-document.entity';

@Controller('scholarships/:scholarshipId/documents')
@ApiTags('Scholarship Documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ScholarshipDocumentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SPONSOR)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: '[Admin/Sponsor] Upload document for scholarship',
    description:
      'Upload supporting documents (PDF, DOC, DOCX, JPG, PNG). Max size: 10MB',
  })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'scholarshipId', description: 'Scholarship UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['title', 'file'],
      properties: {
        title: { type: 'string', example: 'Application Form' },
        description: { type: 'string', example: 'Required application form' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Document uploaded successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Sponsor only' })
  @ApiResponse({ status: 404, description: 'Scholarship not found' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Param('scholarshipId') scholarshipId: string,
    @Body() body: unknown,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const dto: UploadDocumentDtoType = validateUploadDocumentDto(body);

    const command = new UploadDocumentCommand({
      scholarshipId,
      title: dto.title,
      description: dto.description,
      file,
    });

    return await this.commandBus.execute(command);
  }

  @Get()
  @ApiOperation({
    summary: 'List all documents for a scholarship',
    description: 'Get all documents attached to a scholarship',
  })
  @ApiParam({ name: 'scholarshipId', description: 'Scholarship UUID' })
  @ApiResponse({
    status: 200,
    description: 'Documents retrieved successfully',
  })
  async getDocuments(
    @Param('scholarshipId') scholarshipId: string,
  ): Promise<any> {
    const query = new GetDocumentsQuery(scholarshipId);
    return await this.queryBus.execute(query);
  }

  @Get(':documentId')
  @ApiOperation({
    summary: 'Get document details',
    description: 'Get details of a specific document',
  })
  @ApiParam({ name: 'scholarshipId', description: 'Scholarship UUID' })
  @ApiParam({ name: 'documentId', description: 'Document UUID' })
  @ApiResponse({
    status: 200,
    description: 'Document retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async getDocument(
    @Param('scholarshipId') scholarshipId: string,
    @Param('documentId') documentId: string,
  ): Promise<any> {
    const query = new GetDocumentQuery(documentId, scholarshipId);
    return await this.queryBus.execute(query);
  }

  @Get(':documentId/download')
  @ApiOperation({
    summary: 'Download document',
    description: 'Redirect to document download URL',
  })
  @ApiParam({ name: 'scholarshipId', description: 'Scholarship UUID' })
  @ApiParam({ name: 'documentId', description: 'Document UUID' })
  @ApiResponse({
    status: 302,
    description: 'Redirect to document URL',
  })
  async downloadDocument(
    @Param('scholarshipId') scholarshipId: string,
    @Param('documentId') documentId: string,
    @Res() res: Response,
  ): Promise<void> {
    const query = new GetDocumentQuery(documentId, scholarshipId);
    const document = await this.queryBus.execute<
      GetDocumentQuery,
      ScholarshipDocument
    >(query);

    res.redirect(document.fileUrl);
  }

  @Delete(':documentId')
  @Roles(UserRole.ADMIN, UserRole.SPONSOR)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: '[Admin/Sponsor] Delete document',
    description: 'Delete a document from scholarship',
  })
  @ApiParam({ name: 'scholarshipId', description: 'Scholarship UUID' })
  @ApiParam({ name: 'documentId', description: 'Document UUID' })
  @ApiResponse({
    status: 200,
    description: 'Document deleted successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin/Sponsor only' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async deleteDocument(
    @Param('scholarshipId') scholarshipId: string,
    @Param('documentId') documentId: string,
  ): Promise<void> {
    const command = new DeleteDocumentCommand(documentId, scholarshipId);
    await this.commandBus.execute(command);
  }
}
