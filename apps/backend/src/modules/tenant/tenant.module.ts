import { Module } from '@nestjs/common';
import { CreateTenantUseCase } from './application/use-cases/create-tenant.use-case';
import { FindTenantUseCase } from './application/use-cases/find-tenant.use-case';
import { ListTenantsUseCase } from './application/use-cases/list-tenants.use-case';
import { UpdateTenantUseCase } from './application/use-cases/update-tenant.use-case';
import { DeleteTenantUseCase } from './application/use-cases/delete-tenant.use-case';
import { TenantRepository } from './repositories/tenant.repository';
import { TenantService } from './services/tenant.service';
import { TenantController } from './controllers/tenant.controller';

@Module({
  controllers: [TenantController],
  providers: [
    CreateTenantUseCase,
    FindTenantUseCase,
    ListTenantsUseCase,
    UpdateTenantUseCase,
    DeleteTenantUseCase,
    TenantService,
    TenantRepository,
  ],
  exports: [CreateTenantUseCase],
})
export class TenantModule {}
