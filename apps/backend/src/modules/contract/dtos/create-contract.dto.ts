import { IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContractDto {
  @ApiProperty({ example: { nome_cliente: 'João Silva', idade: 30 } })
  @IsNotEmpty()
  @IsObject()
  payload!: Record<string, unknown>;
}
