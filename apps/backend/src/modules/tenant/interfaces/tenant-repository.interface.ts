import { TenantEntity } from '../entities/tenant.entity';

export interface ITenantRepository {
  findById(id: string): Promise<TenantEntity | null>;
  findAll(): Promise<TenantEntity[]>;
  create(name: string): Promise<TenantEntity>;
  update(id: string, name: string): Promise<TenantEntity>;
  softDelete(id: string): Promise<void>;
}
