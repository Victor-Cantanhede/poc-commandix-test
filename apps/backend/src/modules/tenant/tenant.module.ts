import { Module } from '@nestjs/common';
import { CreateTenantUseCase } from './application/use-cases/create-tenant.use-case';
import { TenantRepository } from './repositories/tenant.repository';

@Module({
  providers: [CreateTenantUseCase, TenantRepository],
  exports: [CreateTenantUseCase],
})
export class TenantModule {}
