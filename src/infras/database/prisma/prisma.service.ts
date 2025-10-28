import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await this.$connect();
    console.log('✅ Database connected successfully');
  }

  async onModuleDestroy(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await this.$disconnect();
    console.log('❌ Database disconnected');
  }

  /**
   * Clean database - Use only for testing
   *
   * Deletes all data from all tables in correct order to respect foreign keys.
   * Uses explicit Prisma model methods for clarity and maintainability.
   *
   * @throws Error if NODE_ENV is production
   *
   * Note: Prisma model properties are typed as `any` in PrismaClient base class.
   * We must disable eslint for these unavoidable `any` types from Prisma's design.
   */
  async cleanDatabase(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production environment!');
    }

    /* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

    // Delete in correct order: children first, then parents
    // This respects foreign key constraints without using CASCADE

    // Application related (children first)
    await this.applicationReview.deleteMany({});
    await this.applicationDocument.deleteMany({});
    await this.applicationTimeline.deleteMany({});
    await this.application.deleteMany({});

    // Scholarship related (children first)
    await this.savedScholarship.deleteMany({});
    await this.scholarshipDocument.deleteMany({});
    await this.eligibilityCriteria.deleteMany({});
    await this.scholarshipRequirement.deleteMany({});
    await this.scholarshipCategory.deleteMany({});
    await this.scholarship.deleteMany({});

    // Communication
    await this.message.deleteMany({});
    await this.notification.deleteMany({});

    // Auth related
    await this.passwordReset.deleteMany({});
    await this.emailVerification.deleteMany({});
    await this.refreshToken.deleteMany({});

    // User related (children first)
    await this.sponsorProfile.deleteMany({});
    await this.studentProfile.deleteMany({});
    await this.profile.deleteMany({});
    await this.user.deleteMany({});

    // Audit
    await this.auditLog.deleteMany({});

    /* eslint-enable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

    console.log('🧹 Database cleaned successfully (for testing only)');
  }
}
