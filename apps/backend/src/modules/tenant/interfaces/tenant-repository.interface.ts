import { TenantEntity } from '../entities/tenant.entity';

export interface ITenantRepository {
  findById(id: string): Promise<TenantEntity | null>;
  update(id: string, name: string): Promise<TenantEntity>;
}
