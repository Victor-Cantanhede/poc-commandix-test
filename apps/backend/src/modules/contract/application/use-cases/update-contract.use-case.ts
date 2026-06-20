import { Injectable } from '@nestjs/common';
import { ContractService } from '../../services/contract.service';
import { UpdateContractDto } from '../../dtos/update-contract.dto';
import { ContractEntity } from '../../entities/contract.entity';

@Injectable()
export class UpdateContractUseCase {
  constructor(private readonly contractService: ContractService) {}

  async execute(
    tenantId: string,
    userId: string,
    id: string,
    data: UpdateContractDto,
  ): Promise<ContractEntity> {
    return this.contractService.update(tenantId, userId, id, data);
  }
}
