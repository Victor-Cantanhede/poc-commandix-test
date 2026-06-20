import { Injectable } from '@nestjs/common';
import { TenantService } from '../../services/tenant.service';

@Injectable()
export class DeleteTenantUseCase {
  constructor(private tenantService: TenantService) {}

  async execute(id: string) {
    await this.tenantService.softDelete(id);
  }
}
