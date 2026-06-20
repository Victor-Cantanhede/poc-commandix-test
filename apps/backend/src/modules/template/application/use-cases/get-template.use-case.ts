import { Injectable } from '@nestjs/common';
import { TemplateService } from '../../services/template.service';

@Injectable()
export class GetTemplateUseCase {
  constructor(private readonly templateService: TemplateService) {}

  async execute(tenantId: string) {
    return this.templateService.getTemplate(tenantId);
  }
}
