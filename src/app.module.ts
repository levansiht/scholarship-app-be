import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infras/database/database.module';
import { RepositoriesModule } from './infras/repositories/repositories.module';
import { UserModule } from './presentation/http/modules/user.module';
import { ScholarshipModule } from './presentation/http/modules/scholarship.module';
import { ApplicationModule } from './presentation/http/modules/application.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    RepositoriesModule,
    UserModule,
    ScholarshipModule,
    ApplicationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
