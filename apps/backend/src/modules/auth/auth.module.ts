import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthRepository } from './repositories/auth.repository';
import { TenantModule } from '../tenant/tenant.module';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../../core/auth/auth.guard';
import { RolesGuard } from '../../core/auth/roles.guard';

@Module({
  imports: [
    TenantModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'fallback-secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthRepository,
    LoginUseCase,
    RefreshTokenUseCase,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AuthRepository],
})
export class AuthModule {}

