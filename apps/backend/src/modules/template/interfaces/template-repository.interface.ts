import { Template, TemplateField } from '../entities/template.entity';

export const ITemplateRepository = Symbol('ITemplateRepository');

export interface ITemplateRepository {
  findByTenantId(tenantId: string): Promise<Template | null>;
  create(tenantId: string, schema: TemplateField[]): Promise<Template>;
  update(tenantId: string, schema: TemplateField[]): Promise<Template>;
}
