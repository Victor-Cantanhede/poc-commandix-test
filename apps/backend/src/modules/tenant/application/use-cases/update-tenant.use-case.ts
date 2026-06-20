import { Injectable } from '@nestjs/common';
import { TenantService } from '../../services/tenant.service';
import { UpdateTenantDto } from '../../dtos/tenant.dto';

@Injectable()
export class UpdateTenantUseCase {
  constructor(private tenantService: TenantService) {}

  async execute(id: string, data: UpdateTenantDto) {
    return this.tenantService.update(id, data.name);
  }
}
