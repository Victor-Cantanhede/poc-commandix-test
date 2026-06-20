import { Injectable } from '@nestjs/common';
import { ContractService } from '../../services/contract.service';
import { ContractQueryDto } from '../../dtos/contract-query.dto';
import { PaginatedResult } from '../../interfaces/contract.repository.interface';
import { ContractEntity } from '../../entities/contract.entity';

@Injectable()
export class ListContractsUseCase {
  constructor(private readonly contractService: ContractService) {}

  async execute(
    tenantId: string,
    query: ContractQueryDto,
  ): Promise<PaginatedResult<ContractEntity>> {
    return this.contractService.findAll(tenantId, query);
  }
}
