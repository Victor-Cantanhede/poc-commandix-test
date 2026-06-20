import { IsOptional, IsObject, IsEnum } from 'class-validator';
import { ContractStatus } from '../entities/contract.entity';

export class UpdateContractDto {
  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;

  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;
}
