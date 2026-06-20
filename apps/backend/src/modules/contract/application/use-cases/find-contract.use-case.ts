import { Injectable } from '@nestjs/common';
import { ContractService } from '../../services/contract.service';
import { ContractEntity } from '../../entities/contract.entity';

@Injectable()
export class FindContractUseCase {
  constructor(private readonly contractService: ContractService) {}

  async execute(tenantId: string, id: string): Promise<ContractEntity> {
    return this.contractService.findById(tenantId, id);
  }
}
