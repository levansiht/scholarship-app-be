import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  JwtAuthGuard,
  CurrentUser,
  Roles,
  RolesGuard,
} from '../../../infras/auth';
import {
  CreateSponsorProfileDto,
  UpdateSponsorProfileDto,
} from '../dtos/sponsor-profile.dto';
import {
  CreateSponsorProfileCommand,
  UpdateSponsorProfileCommand,
  VerifySponsorCommand,
} from '../../../core/application/commands/sponsor-profile';
import {
  GetOwnSponsorProfileQuery,
  GetPublicSponsorProfileQuery,
} from '../../../core/application/queries/sponsor-profile';
import { SponsorProfile, UserRole } from '../../../core/domain/entities';

@Controller('sponsors')
@UseGuards(JwtAuthGuard)
export class SponsorProfileController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('profile')
  @Roles(UserRole.SPONSOR)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  async createProfile(
    @CurrentUser('userId') userId: string,
    @Body() dto: CreateSponsorProfileDto,
  ): Promise<SponsorProfile> {
    const command = new CreateSponsorProfileCommand({
      userId,
      organizationName: dto.organizationName,
      organizationType: dto.organizationType,
      description: dto.description,
      website: dto.website,
      logo: dto.logo,
      taxId: dto.taxId,
      contactEmail: dto.contactEmail,
    });

    return this.commandBus.execute(command);
  }

  @Get('me/profile')
  @Roles(UserRole.SPONSOR)
  @UseGuards(RolesGuard)
  async getOwnProfile(
    @CurrentUser('userId') userId: string,
  ): Promise<SponsorProfile> {
    const query = new GetOwnSponsorProfileQuery(userId);
    return this.queryBus.execute(query);
  }

  @Patch('me/profile')
  @Roles(UserRole.SPONSOR)
  @UseGuards(RolesGuard)
  async updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateSponsorProfileDto,
  ): Promise<SponsorProfile> {
    const command = new UpdateSponsorProfileCommand(userId, dto);
    return this.commandBus.execute(command);
  }

  @Get(':userId/profile')
  async getPublicProfile(
    @Param('userId') userId: string,
  ): Promise<SponsorProfile> {
    const query = new GetPublicSponsorProfileQuery(userId);
    return this.queryBus.execute(query);
  }

  @Patch(':userId/verify')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  async verifySponsor(
    @Param('userId') userId: string,
  ): Promise<SponsorProfile> {
    const command = new VerifySponsorCommand(userId);
    return this.commandBus.execute(command);
  }
}
