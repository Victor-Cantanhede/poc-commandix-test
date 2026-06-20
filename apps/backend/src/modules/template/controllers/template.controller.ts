import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { Roles } from '../../../core/auth/decorators';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../../core/auth/current-user.decorator';
import { GetTemplateUseCase } from '../application/use-cases/get-template.use-case';
import { UpdateTemplateUseCase } from '../application/use-cases/update-template.use-case';
import { UpdateTemplateDto } from '../dtos/update-template.dto';
import { JwtPayload } from '../../../core/auth/interfaces/jwt-payload.interface';
import { AuthGuard } from '../../../core/auth/auth.guard';
import { RolesGuard } from '../../../core/auth/roles.guard';

@Controller('templates')
@UseGuards(AuthGuard, RolesGuard)
export class TemplateController {
  constructor(
    private readonly getTemplateUseCase: GetTemplateUseCase,
    private readonly updateTemplateUseCase: UpdateTemplateUseCase,
  ) {}

  @Get()
  async getTemplate(@CurrentUser() user: JwtPayload) {
    return this.getTemplateUseCase.execute(user.tenantId);
  }

  @Put()
  @Roles(Role.ADMIN)
  async updateTemplate(@CurrentUser() user: JwtPayload, @Body() dto: UpdateTemplateDto) {
    return this.updateTemplateUseCase.execute(user.tenantId, dto);
  }
}
