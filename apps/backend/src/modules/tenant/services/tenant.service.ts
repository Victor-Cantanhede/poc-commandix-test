import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantRepository } from '../repositories/tenant.repository';
import { TenantEntity } from '../entities/tenant.entity';

@Injectable()
export class TenantService {
  constructor(private tenantRepository: TenantRepository) {}

  async findById(id: string): Promise<TenantEntity> {
    const tenant = await this.tenantRepository.findById(id);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return tenant;
  }

  async update(id: string, name: string): Promise<TenantEntity> {
    await this.findById(id); // Valida se existe
    return this.tenantRepository.update(id, name);
  }
}
