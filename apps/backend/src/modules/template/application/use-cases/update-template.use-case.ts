import { Injectable } from '@nestjs/common';
import { TemplateService } from '../../services/template.service';
import { UpdateTemplateDto } from '../../dtos/update-template.dto';

@Injectable()
export class UpdateTemplateUseCase {
  constructor(private readonly templateService: TemplateService) {}

  async execute(tenantId: string, dto: UpdateTemplateDto) {
    return this.templateService.updateTemplate(tenantId, dto.schema);
  }
}
