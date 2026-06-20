import { Injectable } from '@nestjs/common';
import { TenantService } from '../../services/tenant.service';

@Injectable()
export class ListTenantsUseCase {
  constructor(private tenantService: TenantService) {}

  async execute() {
    return this.tenantService.findAll();
  }
}
