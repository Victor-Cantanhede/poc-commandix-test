import {
  Controller,
  Get,
  Patch,
  Body,
} from '@nestjs/common';
import { Roles } from '../../../core/auth/decorators';
import { Role } from '@prisma/client';
import { UpdateTenantDto } from '../dtos/tenant.dto';
import { FindTenantUseCase } from '../application/use-cases/find-tenant.use-case';
import { UpdateTenantUseCase } from '../application/use-cases/update-tenant.use-case';
import { CurrentUser } from '../../../core/auth/current-user.decorator';
import { JwtPayload } from '../../../core/auth/interfaces/jwt-payload.interface';

@Controller('tenants')
@Roles(Role.ADMIN) // Apenas administradores podem gerenciar seu próprio tenant
export class TenantController {
  constructor(
    private findTenantUseCase: FindTenantUseCase,
    private updateTenantUseCase: UpdateTenantUseCase,
  ) {}

  @Get('me')
  async findMyTenant(@CurrentUser() user: JwtPayload) {
    return this.findTenantUseCase.execute(user.tenantId);
  }

  @Patch('me')
  async updateMyTenant(
    @CurrentUser() user: JwtPayload,
    @Body() body: UpdateTenantDto,
  ) {
    return this.updateTenantUseCase.execute(user.tenantId, body);
  }
}
