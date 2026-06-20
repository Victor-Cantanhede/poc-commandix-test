import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { CreateContractUseCase } from '../application/use-cases/create-contract.use-case';
import { UpdateContractUseCase } from '../application/use-cases/update-contract.use-case';
import { ChangeStatusUseCase } from '../application/use-cases/change-status.use-case';
import { ListContractsUseCase } from '../application/use-cases/list-contracts.use-case';
import { FindContractUseCase } from '../application/use-cases/find-contract.use-case';
import { CreateContractDto } from '../dtos/create-contract.dto';
import { UpdateContractDto } from '../dtos/update-contract.dto';
import { ContractQueryDto } from '../dtos/contract-query.dto';
import { ChangeStatusDto } from '../dtos/change-status.dto';
import { CurrentUser } from '../../../core/auth/current-user.decorator';
import { Roles } from '../../../core/auth/decorators';
import { Role } from '@prisma/client';
import { JwtPayload } from '../../../core/auth/interfaces/jwt-payload.interface';
import { AuthGuard } from '../../../core/auth/auth.guard';
import { RolesGuard } from '../../../core/auth/roles.guard';

@Controller('contracts')
@UseGuards(AuthGuard, RolesGuard)
export class ContractController {
  constructor(
    private readonly createContractUseCase: CreateContractUseCase,
    private readonly updateContractUseCase: UpdateContractUseCase,
    private readonly changeStatusUseCase: ChangeStatusUseCase,
    private readonly listContractsUseCase: ListContractsUseCase,
    private readonly findContractUseCase: FindContractUseCase,
  ) {}

  @Roles(Role.ADMIN, Role.VIEWER)
  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() createContractDto: CreateContractDto) {
    return this.createContractUseCase.execute(user.tenantId, user.userId, createContractDto);
  }

  @Roles(Role.ADMIN, Role.VIEWER)
  @Get()
  findAll(@CurrentUser() user: JwtPayload, @Query() query: ContractQueryDto) {
    return this.listContractsUseCase.execute(user.tenantId, query);
  }

  @Roles(Role.ADMIN, Role.VIEWER)
  @Get(':id')
  findById(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.findContractUseCase.execute(user.tenantId, id);
  }

  @Roles(Role.ADMIN, Role.VIEWER)
  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.updateContractUseCase.execute(user.tenantId, user.userId, id, updateContractDto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/status')
  changeStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.changeStatusUseCase.execute(user.tenantId, user.userId, id, changeStatusDto.status);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    throw new Error('Not implemented. Needs use case');
  }
}
