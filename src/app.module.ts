import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { DatabaseModule } from './infras/database/database.module';
import { RepositoriesModule } from './infras/repositories/repositories.module';
import { AuthModule } from './presentation/http/modules/auth.module';
import { UserModule } from './presentation/http/modules/user.module';
import { ScholarshipModule } from './presentation/http/modules/scholarship.module';
import { ApplicationModule } from './presentation/http/modules/application.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
