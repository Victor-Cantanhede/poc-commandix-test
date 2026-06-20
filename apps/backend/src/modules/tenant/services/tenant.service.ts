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

  async findAll(): Promise<TenantEntity[]> {
    return this.tenantRepository.findAll();
  }

  async create(name: string): Promise<TenantEntity> {
    return this.tenantRepository.create(name);
  }

  async update(id: string, name: string): Promise<TenantEntity> {
    await this.findById(id); // Valida se existe
    return this.tenantRepository.update(id, name);
  }

  async softDelete(id: string): Promise<void> {
    await this.findById(id); // Valida se existe
    await this.tenantRepository.softDelete(id);
  }
}
