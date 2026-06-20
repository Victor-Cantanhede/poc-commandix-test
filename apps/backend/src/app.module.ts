import { Module } from '@nestjs/common';
import { ConfigModule } from './core/config/config.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { TemplateModule } from './modules/template/template.module';
import { ContractModule } from './modules/contract/contract.module';
import { HistoryModule } from './modules/history/history.module';

@Module({
  imports: [ConfigModule, PrismaModule, HealthModule, TenantModule, AuthModule, TemplateModule, ContractModule, HistoryModule],
})
export class AppModule {}
