export type TemplateFieldType = 'text' | 'number' | 'date' | 'boolean';

export interface TemplateField {
  name: string;
  type: TemplateFieldType;
  required: boolean;
}

export interface Template {
  id: string;
  tenantId: string;
  schema: TemplateField[];
  createdAt: string;
  updatedAt: string;
}
