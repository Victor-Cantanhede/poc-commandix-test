import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../../core/auth/decorators';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../../core/auth/current-user.decorator';
import { GetTemplateUseCase } from '../application/use-cases/get-template.use-case';
import { UpdateTemplateUseCase } from '../application/use-cases/update-template.use-case';
import { UpdateTemplateDto } from '../dtos/update-template.dto';
import { JwtPayload } from '../../../core/auth/interfaces/jwt-payload.interface';
import { AuthGuard } from '../../../core/auth/auth.guard';
import { RolesGuard } from '../../../core/auth/roles.guard';

@ApiTags('Templates')
@ApiBearerAuth()
@Controller('templates')
@UseGuards(AuthGuard, RolesGuard)
export class TemplateController {
  constructor(
    private readonly getTemplateUseCase: GetTemplateUseCase,
    private readonly updateTemplateUseCase: UpdateTemplateUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obter o template de contratos do tenant' })
  @ApiResponse({ status: 200, description: 'Template retornado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async getTemplate(@CurrentUser() user: JwtPayload) {
    return this.getTemplateUseCase.execute(user.tenantId);
  }

  @Put()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar o template de contratos do tenant' })
  @ApiResponse({ status: 200, description: 'Template atualizado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async updateTemplate(@CurrentUser() user: JwtPayload, @Body() dto: UpdateTemplateDto) {
    return this.updateTemplateUseCase.execute(user.tenantId, dto);
  }
}
