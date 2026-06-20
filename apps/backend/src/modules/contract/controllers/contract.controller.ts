import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { ContractService } from '../services/contract.service';
import { CreateContractDto } from '../dtos/create-contract.dto';
import { UpdateContractDto } from '../dtos/update-contract.dto';
import { ContractQueryDto } from '../dtos/contract-query.dto';
import { CurrentUser } from '../../../core/auth/current-user.decorator';
import { Roles } from '../../../core/auth/decorators';
import { Role } from '@prisma/client';

@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Roles(Role.ADMIN, Role.VIEWER)
  @Post()
  create(@CurrentUser() user: any, @Body() createContractDto: CreateContractDto) {
    return this.contractService.create(user.tenantId, createContractDto);
  }

  @Roles(Role.ADMIN, Role.VIEWER)
  @Get()
  findAll(@CurrentUser() user: any, @Query() query: ContractQueryDto) {
    return this.contractService.findAll(user.tenantId, query);
  }

  @Roles(Role.ADMIN, Role.VIEWER)
  @Get(':id')
  findById(@CurrentUser() user: any, @Param('id') id: string) {
    return this.contractService.findById(user.tenantId, id);
  }

  @Roles(Role.ADMIN, Role.VIEWER)
  @Patch(':id')
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() updateContractDto: UpdateContractDto) {
    return this.contractService.update(user.tenantId, id, updateContractDto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/status')
  changeStatus(@CurrentUser() user: any, @Param('id') id: string, @Body('status') status: any) {
    return this.contractService.changeStatus(user.tenantId, id, status);
  }
}
