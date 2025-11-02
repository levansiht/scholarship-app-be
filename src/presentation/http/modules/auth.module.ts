import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { AuthController } from '../controllers/auth.controller';
import { RegisterCommandHandler } from '../../../core/application/commands/auth/register.command-handler';
import { LoginQueryHandler } from '../../../core/application/queries/auth/login.query-handler';
import { JwtStrategy } from '../../../infras/auth/jwt.strategy';
import { RepositoriesModule } from '../../../infras/repositories/repositories.module';

@Module({
  imports: [
    CqrsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const secret = configService.get<string>('JWT_SECRET');
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN') || '7d';

        return {
          secret,
          signOptions: {
            expiresIn: expiresIn as StringValue | number,
          },
        };
      },
      inject: [ConfigService],
    }),
    RepositoriesModule,
  ],
  controllers: [AuthController],
  providers: [RegisterCommandHandler, LoginQueryHandler, JwtStrategy],
  exports: [JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
