import { Injectable } from '@nestjs/common';
import { TenantService } from '../../services/tenant.service';

@Injectable()
export class FindTenantUseCase {
  constructor(private tenantService: TenantService) {}

  async execute(id: string) {
    return this.tenantService.findById(id);
  }
}
