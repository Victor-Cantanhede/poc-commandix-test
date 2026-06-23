import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ContractStatus } from '../entities/contract.entity';

export class ContractQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Número da página', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Quantidade de itens por página', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ enum: ContractStatus, description: 'Filtrar por status do contrato' })
  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;

  @ApiPropertyOptional({ example: 'João', description: 'Buscar por termo livre no payload' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: '2023-01-01T00:00:00Z', description: 'Data inicial' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2023-12-31T23:59:59Z', description: 'Data final' })
  @IsOptional()
  @IsString()
  endDate?: string;
}
