import { Controller, Get, Put, Body } from '@nestjs/common';
import { Roles } from '../../../core/auth/decorators';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../../core/auth/current-user.decorator';
import { GetTemplateUseCase } from '../application/use-cases/get-template.use-case';
import { UpdateTemplateUseCase } from '../application/use-cases/update-template.use-case';
import { UpdateTemplateDto } from '../dtos/update-template.dto';

@Controller('templates')
export class TemplateController {
  constructor(
    private readonly getTemplateUseCase: GetTemplateUseCase,
    private readonly updateTemplateUseCase: UpdateTemplateUseCase,
  ) {}

  @Get()
  async getTemplate(@CurrentUser() user: any) {
    return this.getTemplateUseCase.execute(user.tenantId);
  }

  @Put()
  @Roles(Role.ADMIN)
  async updateTemplate(
    @CurrentUser() user: any,
    @Body() dto: UpdateTemplateDto,
  ) {
    return this.updateTemplateUseCase.execute(user.tenantId, dto);
  }
}
