import { Injectable, BadRequestException } from '@nestjs/common';
import { ContractService } from '../../services/contract.service';
import { CreateContractDto } from '../../dtos/create-contract.dto';
import { ContractEntity } from '../../entities/contract.entity';

@Injectable()
export class CreateContractUseCase {
  constructor(private readonly contractService: ContractService) {}

  async execute(
    tenantId: string,
    userId: string,
    data: CreateContractDto,
  ): Promise<ContractEntity> {
    return this.contractService.create(tenantId, userId, data);
  }
}
