import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContractStatus } from '../entities/contract.entity';

export class ChangeStatusDto {
  @ApiProperty({ enum: ContractStatus, example: ContractStatus.ACTIVE })
  @IsEnum(ContractStatus)
  status!: ContractStatus;
}
