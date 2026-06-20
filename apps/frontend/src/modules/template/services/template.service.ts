import { api } from '../../../shared/services/api';
import { Template, TemplateField } from '../types/template.types';

export const templateService = {
  getTemplate: async (): Promise<Template> => {
    const { data } = await api.get<Template>('/api/templates');
    return data;
  },
  updateTemplate: async (schema: TemplateField[]): Promise<Template> => {
    const { data } = await api.put<Template>('/api/templates', { schema });
    return data;
  },
};
