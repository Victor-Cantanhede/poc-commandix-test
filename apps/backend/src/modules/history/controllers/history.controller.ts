import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { HistoryService } from '../services/history.service';
import { CurrentUser } from '../../../core/auth/current-user.decorator';
import { Roles } from '../../../core/auth/decorators';
import { Role } from '@prisma/client';
import { AuthGuard } from '../../../core/auth/auth.guard';
import { JwtPayload } from '../../../core/auth/interfaces/jwt-payload.interface';

@ApiTags('Histórico')
@ApiBearerAuth()
@Controller('contracts/:contractId/history')
@UseGuards(AuthGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Roles(Role.ADMIN, Role.VIEWER)
  @Get()
  @ApiOperation({ summary: 'Obter histórico de alterações de um contrato' })
  @ApiParam({ name: 'contractId', description: 'ID do contrato' })
  @ApiResponse({ status: 200, description: 'Histórico retornado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado.' })
  async getHistory(@CurrentUser() user: JwtPayload, @Param('contractId') contractId: string) {
    return this.historyService.getContractHistory(user.tenantId, contractId);
  }
}
