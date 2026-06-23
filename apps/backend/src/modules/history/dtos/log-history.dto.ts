import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LogHistoryDto {
  @ApiProperty({ example: 'uuid-do-contrato' })
  contractId!: string;

  @ApiProperty({ example: 'uuid-do-usuario' })
  userId!: string;

  @ApiProperty({ example: 'CONTRATO_CRIADO' })
  action!: string;

  @ApiPropertyOptional({ example: 'status' })
  field?: string;

  @ApiPropertyOptional({ example: 'DRAFT' })
  oldValue?: unknown;

  @ApiPropertyOptional({ example: 'ACTIVE' })
  newValue?: unknown;
}
