import { ContractEntity } from '../entities/contract.entity';
import { ContractQueryDto } from '../dtos/contract-query.dto';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IContractRepository {
  create(contract: Omit<ContractEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<ContractEntity>;
  findById(id: string, tenantId: string): Promise<ContractEntity | null>;
  update(id: string, tenantId: string, data: Partial<ContractEntity>): Promise<ContractEntity>;
  findAll(tenantId: string, query: ContractQueryDto): Promise<PaginatedResult<ContractEntity>>;
}
