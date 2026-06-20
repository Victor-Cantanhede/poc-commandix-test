import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Roles } from '../../../core/auth/decorators';
import { Role } from '@prisma/client';
import { CreateTenantDto, UpdateTenantDto } from '../dtos/tenant.dto';
import { TenantService } from '../services/tenant.service';
import { FindTenantUseCase } from '../application/use-cases/find-tenant.use-case';
import { ListTenantsUseCase } from '../application/use-cases/list-tenants.use-case';
import { UpdateTenantUseCase } from '../application/use-cases/update-tenant.use-case';
import { DeleteTenantUseCase } from '../application/use-cases/delete-tenant.use-case';

@Controller('tenants')
@Roles(Role.ADMIN) // Apenas administradores podem gerenciar tenants
export class TenantController {
  constructor(
    private tenantService: TenantService,
    private findTenantUseCase: FindTenantUseCase,
    private listTenantsUseCase: ListTenantsUseCase,
    private updateTenantUseCase: UpdateTenantUseCase,
    private deleteTenantUseCase: DeleteTenantUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreateTenantDto) {
    return this.tenantService.create(body.name);
  }

  @Get()
  async findAll() {
    return this.listTenantsUseCase.execute();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.findTenantUseCase.execute(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: UpdateTenantDto) {
    return this.updateTenantUseCase.execute(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.deleteTenantUseCase.execute(id);
  }
}
