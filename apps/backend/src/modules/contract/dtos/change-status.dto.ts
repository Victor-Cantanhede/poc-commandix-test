import { IsEnum } from 'class-validator';
import { ContractStatus } from '../entities/contract.entity';

export class ChangeStatusDto {
  @IsEnum(ContractStatus)
  status!: ContractStatus;
}
