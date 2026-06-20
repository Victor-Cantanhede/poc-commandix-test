import { Injectable } from '@nestjs/common';
import { ContractService } from '../../services/contract.service';
import { ContractStatus, ContractEntity } from '../../entities/contract.entity';

@Injectable()
export class ChangeStatusUseCase {
  constructor(private readonly contractService: ContractService) {}

  async execute(
    tenantId: string,
    userId: string,
    id: string,
    status: ContractStatus,
  ): Promise<ContractEntity> {
    return this.contractService.changeStatus(tenantId, userId, id, status);
  }
}
