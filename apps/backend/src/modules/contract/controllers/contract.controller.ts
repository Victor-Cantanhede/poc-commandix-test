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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
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

@ApiTags('Contratos')
@ApiBearerAuth()
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
  @ApiOperation({ summary: 'Criar um novo contrato' })
  @ApiResponse({ status: 201, description: 'Contrato criado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  create(@CurrentUser() user: JwtPayload, @Body() createContractDto: CreateContractDto) {
    return this.createContractUseCase.execute(user.tenantId, user.userId, createContractDto);
  }

  @Roles(Role.ADMIN, Role.VIEWER)
  @Get()
  @ApiOperation({ summary: 'Listar contratos com filtros e paginação' })
  @ApiResponse({ status: 200, description: 'Lista de contratos retornada com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  findAll(@CurrentUser() user: JwtPayload, @Query() query: ContractQueryDto) {
    return this.listContractsUseCase.execute(user.tenantId, query);
  }

  @Roles(Role.ADMIN, Role.VIEWER)
  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um contrato específico' })
  @ApiParam({ name: 'id', description: 'ID do contrato' })
  @ApiResponse({ status: 200, description: 'Contrato retornado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado.' })
  findById(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.findContractUseCase.execute(user.tenantId, id);
  }

  @Roles(Role.ADMIN, Role.VIEWER)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados e status de um contrato' })
  @ApiParam({ name: 'id', description: 'ID do contrato' })
  @ApiResponse({ status: 200, description: 'Contrato atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado.' })
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.updateContractUseCase.execute(user.tenantId, user.userId, id, updateContractDto);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/status')
  @ApiOperation({ summary: 'Alterar o status de um contrato (Apenas ADMIN)' })
  @ApiParam({ name: 'id', description: 'ID do contrato' })
  @ApiResponse({ status: 200, description: 'Status do contrato alterado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  @ApiResponse({ status: 404, description: 'Contrato não encontrado.' })
  changeStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeStatusDto,
  ) {
    return this.changeStatusUseCase.execute(user.tenantId, user.userId, id, changeStatusDto.status);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Excluir um contrato (Não implementado)' })
  @ApiParam({ name: 'id', description: 'ID do contrato' })
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    throw new Error('Not implemented. Needs use case');
  }
}
