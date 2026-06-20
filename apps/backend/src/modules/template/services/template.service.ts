import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { ITemplateRepository } from '../interfaces/template-repository.interface';
import { Template, TemplateField } from '../entities/template.entity';

@Injectable()
export class TemplateService {
  constructor(
    @Inject(ITemplateRepository)
    private readonly templateRepository: ITemplateRepository,
  ) {}

  async getTemplate(tenantId: string): Promise<Template> {
    let template = await this.templateRepository.findByTenantId(tenantId);
    
    if (!template) {
      // Cria um template vazio por padrão caso não exista
      template = await this.templateRepository.create(tenantId, []);
    }
    
    return template;
  }

  async updateTemplate(tenantId: string, schema: TemplateField[]): Promise<Template> {
    // Regra de negócio: Não permitir campos com nomes duplicados
    const names = schema.map((field) => field.name.toLowerCase().trim());
    const uniqueNames = new Set(names);
    if (names.length !== uniqueNames.size) {
      throw new BadRequestException('Não é permitido ter campos com o mesmo nome no template.');
    }

    let template = await this.templateRepository.findByTenantId(tenantId);
    if (!template) {
      return this.templateRepository.create(tenantId, schema);
    }

    return this.templateRepository.update(tenantId, schema);
  }
}
