import { IsOptional, IsObject, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ContractStatus } from '../entities/contract.entity';

export class UpdateContractDto {
  @ApiPropertyOptional({ example: { nome_cliente: 'João Silva', idade: 30 } })
  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;

  @ApiPropertyOptional({ enum: ContractStatus, example: ContractStatus.DRAFT })
  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;
}
