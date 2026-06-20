import { Controller, Get, Param } from '@nestjs/common';
import { HistoryService } from '../services/history.service';
import { CurrentUser } from '../../../core/auth/current-user.decorator';
import { Roles } from '../../../core/auth/decorators';
import { Role } from '@prisma/client';

@Controller('contracts/:contractId/history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Roles(Role.ADMIN, Role.VIEWER)
  @Get()
  getContractHistory(
    @CurrentUser() user: any,
    @Param('contractId') contractId: string,
  ) {
    return this.historyService.getContractHistory(user.tenantId, contractId);
  }
}
