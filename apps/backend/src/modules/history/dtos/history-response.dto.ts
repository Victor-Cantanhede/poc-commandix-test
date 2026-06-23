import { ApiProperty } from '@nestjs/swagger';

export class HistoryResponseDto {
  @ApiProperty({ example: 'uuid-do-historico' })
  id!: string;

  @ApiProperty({ example: 'uuid-do-contrato' })
  contractId!: string;

  @ApiProperty({ example: 'STATUS_CHANGED' })
  action!: string;

  @ApiProperty({ example: 'status', nullable: true })
  field!: string | null;

  @ApiProperty({ example: 'DRAFT', nullable: true })
  oldValue!: unknown | null;

  @ApiProperty({ example: 'ACTIVE', nullable: true })
  newValue!: unknown | null;

  @ApiProperty({ example: '2023-10-25T10:00:00Z' })
  createdAt!: Date;

  @ApiProperty({
    example: { name: 'João Silva', email: 'joao@email.com' }
  })
  user!: {
    name: string;
    email: string;
  };
}
