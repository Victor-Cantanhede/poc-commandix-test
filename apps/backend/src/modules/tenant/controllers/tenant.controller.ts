import {
  Controller,
  Get,
  Patch,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../../core/auth/decorators';
import { Role } from '@prisma/client';
import { UpdateTenantDto } from '../dtos/tenant.dto';
import { FindTenantUseCase } from '../application/use-cases/find-tenant.use-case';
import { UpdateTenantUseCase } from '../application/use-cases/update-tenant.use-case';
import { CurrentUser } from '../../../core/auth/current-user.decorator';
import { JwtPayload } from '../../../core/auth/interfaces/jwt-payload.interface';

@ApiTags('Tenants')
@ApiBearerAuth()
@Controller('tenants')
@Roles(Role.ADMIN) // Apenas administradores podem gerenciar seu próprio tenant
export class TenantController {
  constructor(
    private findTenantUseCase: FindTenantUseCase,
    private updateTenantUseCase: UpdateTenantUseCase,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Obter dados do próprio tenant' })
  @ApiResponse({ status: 200, description: 'Dados do tenant retornados com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async findMyTenant(@CurrentUser() user: JwtPayload) {
    return this.findTenantUseCase.execute(user.tenantId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualizar dados do próprio tenant' })
  @ApiResponse({ status: 200, description: 'Tenant atualizado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async updateMyTenant(
    @CurrentUser() user: JwtPayload,
    @Body() body: UpdateTenantDto,
  ) {
    return this.updateTenantUseCase.execute(user.tenantId, body);
  }
}
