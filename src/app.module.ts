import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { DatabaseModule } from './infras/database/database.module';
import { RepositoriesModule } from './infras/repositories/repositories.module';
import { AuthModule } from './presentation/http/modules/auth.module';
import { UserModule } from './presentation/http/modules/user.module';
import { ScholarshipModule } from './presentation/http/modules/scholarship.module';
import { ApplicationModule } from './presentation/http/modules/application.module';
import { SavedScholarshipModule } from './presentation/http/modules/saved-scholarship.module';
import { ScholarshipCategoryModule } from './presentation/http/modules/scholarship-category.module';
import { ProfileModule } from './presentation/http/modules/profile.module';
import { ScholarshipDocumentModule } from './presentation/http/modules/scholarship-document.module';
import { ScholarshipRequirementModule } from './presentation/http/modules/scholarship-requirement.module';
import { SponsorProfileModule } from './presentation/http/modules/sponsor-profile.module';
import { StudentProfileModule } from './presentation/http/modules/student-profile.module';
import { EligibilityCriteriaModule } from './presentation/http/modules/eligibility-criteria.module';
import { HealthController } from './presentation/http/controllers/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig],
    }),
    DatabaseModule,
    RepositoriesModule,
    AuthModule,
    UserModule,
    ScholarshipModule,
    ApplicationModule,
    SavedScholarshipModule,
    ScholarshipCategoryModule,
    ProfileModule,
    ScholarshipDocumentModule,
    ScholarshipRequirementModule,
    SponsorProfileModule,
    StudentProfileModule,
    EligibilityCriteriaModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
