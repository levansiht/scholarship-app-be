import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infras/database/database.module';
import { RepositoriesModule } from './infras/repositories/repositories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    RepositoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
