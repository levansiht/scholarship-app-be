import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../infras/auth';
import { CurrentUser } from '../../../infras/auth/current-user.decorator';
import { User } from '../../../core/domain/entities';
import { GetProfileQuery } from '../../../core/application/queries/profile';
import {
  UpdateProfileCommand,
  UpdateAvatarCommand,
} from '../../../core/application/commands/profile';
import {
  validateUpdateProfileDto,
  type UpdateProfileDtoType,
} from '../../../core/domain/dtos';
import { SupabaseService } from '../../../infras/storage/supabase/supabase.service';

@Controller('users/me/profile')
@ApiTags('Profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ProfileController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns the profile of the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser() user: User): Promise<any> {
    const query = new GetProfileQuery(user.id);
    return await this.queryBus.execute(query);
  }

  @Patch()
  @ApiOperation({
    summary: 'Update current user profile',
    description: 'Update profile information for the authenticated user',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        phoneNumber: { type: 'string', example: '+84123456789' },
        dateOfBirth: { type: 'string', format: 'date', example: '2000-01-01' },
        address: { type: 'string', example: '123 Main St' },
        city: { type: 'string', example: 'Ho Chi Minh City' },
        country: { type: 'string', example: 'Vietnam' },
        bio: { type: 'string', example: 'Software developer' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async updateProfile(
    @CurrentUser() user: User,
    @Body() body: unknown,
  ): Promise<any> {
    const dto: UpdateProfileDtoType = validateUpdateProfileDto(body);

    const command = new UpdateProfileCommand(user.id, dto);
    return await this.commandBus.execute(command);
  }

  @Patch('avatar')
  @ApiOperation({
    summary: 'Update user avatar',
    description:
      'Upload a new avatar image. Allowed types: JPG, PNG. Max size: 5MB',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Avatar image file',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPG and PNG are allowed',
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    const avatarUrl = await this.supabaseService.uploadFile(
      file.buffer,
      file.originalname,
      `avatars/${user.id}`,
    );

    const command = new UpdateAvatarCommand(user.id, avatarUrl);
    return await this.commandBus.execute(command);
  }
}
