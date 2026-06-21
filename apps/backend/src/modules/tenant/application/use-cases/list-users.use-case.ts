import { Injectable } from '@nestjs/common';
import { TenantRepository } from '../../repositories/tenant.repository';

@Injectable()
export class ListUsersUseCase {
  constructor(private tenantRepository: TenantRepository) {}

  async execute(tenantId: string) {
    return this.tenantRepository.findUsersByTenantId(tenantId);
  }
}
