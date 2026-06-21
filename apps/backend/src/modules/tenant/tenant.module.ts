import { Module } from '@nestjs/common';
import { CreateTenantUseCase } from './application/use-cases/create-tenant.use-case';
import { FindTenantUseCase } from './application/use-cases/find-tenant.use-case';
import { UpdateTenantUseCase } from './application/use-cases/update-tenant.use-case';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user.use-case';
import { TenantRepository } from './repositories/tenant.repository';
import { TenantService } from './services/tenant.service';
import { TenantController } from './controllers/tenant.controller';
import { UserController } from './controllers/user.controller';

@Module({
  controllers: [TenantController, UserController],
  providers: [
    CreateTenantUseCase,
    FindTenantUseCase,
    UpdateTenantUseCase,
    CreateUserUseCase,
    ListUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    TenantService,
    TenantRepository,
  ],
  exports: [CreateTenantUseCase],
})
export class TenantModule {}

