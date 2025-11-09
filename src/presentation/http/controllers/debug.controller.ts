import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../../../infras/database/prisma/prisma.service';

@ApiTags('Debug')
@Controller('debug')
export class DebugController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('users/count')
  @ApiOperation({ summary: 'Count users in database (debug only)' })
  async countUsers() {
    const total = await this.prisma.user.count();
    const admin = await this.prisma.user.count({
      where: { email: 'admin@scholarship.com' },
    });

    const allEmails = await this.prisma.user.findMany({
      select: { email: true, role: true, status: true },
      take: 10,
    });

    return {
      total,
      hasAdmin: admin > 0,
      emails: allEmails,
    };
  }

  @Get('seed/create-admin')
  @ApiOperation({ summary: 'Create admin user if not exists' })
  async seedAdmin() {
    const bcrypt = require('bcrypt');

    const existing = await this.prisma.user.findUnique({
      where: { email: 'admin@scholarship.com' },
    });

    if (existing) {
      // Update password
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      await this.prisma.user.update({
        where: { email: 'admin@scholarship.com' },
        data: {
          password: hashedPassword,
          status: 'ACTIVE',
        },
      });

      return {
        message: 'Admin password reset to: Password123!',
        email: 'admin@scholarship.com',
      };
    }

    // Create new admin
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const admin = await this.prisma.user.create({
      data: {
        email: 'admin@scholarship.com',
        password: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
        profile: {
          create: {
            firstName: 'Admin',
            lastName: 'System',
            fullName: 'Admin System',
            phoneNumber: '+84901234567',
            city: 'Ho Chi Minh',
            country: 'Vietnam',
            bio: 'System Administrator',
          },
        },
      },
    });

    return {
      message: 'Admin created successfully',
      email: admin.email,
      password: 'Password123!',
    };
  }
}
