import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { HistoryService } from '../services/history.service';
import { CurrentUser } from '../../../core/auth/current-user.decorator';
import { Roles } from '../../../core/auth/decorators';
import { Role } from '@prisma/client';
import { AuthGuard } from '../../../core/auth/auth.guard';
import { JwtPayload } from '../../../core/auth/interfaces/jwt-payload.interface';

@Controller('contracts/:contractId/history')
@UseGuards(AuthGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Roles(Role.ADMIN, Role.VIEWER)
  @Get()
  async getHistory(@CurrentUser() user: JwtPayload, @Param('contractId') contractId: string) {
    return this.historyService.getContractHistory(user.tenantId, contractId);
  }
}
