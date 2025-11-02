import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    await this.$connect();
    console.log('✅ Database connected successfully');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    console.log('❌ Database disconnected');
  }

  async cleanDatabase(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production environment!');
    }

    await this.application.deleteMany({});

    await this.savedScholarship.deleteMany({});
    await this.scholarshipDocument.deleteMany({});
    await this.eligibilityCriteria.deleteMany({});
    await this.scholarshipRequirement.deleteMany({});
    await this.scholarshipCategory.deleteMany({});
    await this.scholarship.deleteMany({});

    await this.sponsorProfile.deleteMany({});
    await this.studentProfile.deleteMany({});
    await this.profile.deleteMany({});
    await this.user.deleteMany({});

    console.log('🧹 Database cleaned successfully (for testing only)');
  }
}
