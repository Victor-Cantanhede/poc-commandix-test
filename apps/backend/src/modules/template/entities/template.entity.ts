export type TemplateFieldType = 'text' | 'number' | 'date' | 'boolean';

export class TemplateField {
  name!: string;
  type!: TemplateFieldType;
  required!: boolean;
}

export class Template {
  id!: string;
  tenantId!: string;
  schema!: TemplateField[];
  createdAt!: Date;
  updatedAt!: Date;
}
