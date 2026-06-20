import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { templateService } from '../services/template.service';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { TemplateFieldType } from '../types/template.types';

const templateFieldSchema = z.object({
  name: z.string().min(1, 'Nome do campo é obrigatório'),
  type: z.enum(['text', 'number', 'date', 'boolean']),
  required: z.boolean(),
});

const templateFormSchema = z.object({
  schema: z.array(templateFieldSchema),
});

type TemplateFormValues = z.infer<typeof templateFormSchema>;

export function TemplateConfig() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      schema: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'schema',
  });

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await templateService.getTemplate();
      reset({ schema: data.schema });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar template');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: TemplateFormValues) => {
    try {
      setIsSaving(true);
      setError(null);
      
      // Validação customizada: nomes duplicados
      const names = values.schema.map((f) => f.name.toLowerCase().trim());
      const uniqueNames = new Set(names);
      if (names.length !== uniqueNames.size) {
        toast.error('Não é permitido campos com o mesmo nome');
        return;
      }

      await templateService.updateTemplate(values.schema);
      toast.success('Template salvo com sucesso!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao salvar template');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Template de Contrato</h1>
          <p className="text-muted-foreground">Configure os campos dinâmicos que irão compor seus contratos.</p>
        </div>
        <Button type="button" onClick={() => append({ name: '', type: 'text', required: false })} variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Campo
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-4 items-start p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Nome do Campo</label>
                <Input
                  {...register(`schema.${index}.name` as const)}
                  placeholder="Ex: Nome do Cliente"
                />
                {errors.schema?.[index]?.name && (
                  <p className="text-xs text-destructive">{errors.schema[index]?.name?.message}</p>
                )}
              </div>

              <div className="w-48 space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <select
                  {...register(`schema.${index}.type` as const)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="text">Texto</option>
                  <option value="number">Número</option>
                  <option value="date">Data</option>
                  <option value="boolean">Verdadeiro/Falso</option>
                </select>
              </div>

              <div className="w-32 space-y-2 flex flex-col items-center justify-center">
                <label className="text-sm font-medium">Obrigatório</label>
                <div className="h-10 flex items-center">
                  <input
                    type="checkbox"
                    {...register(`schema.${index}.required` as const)}
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div className="pt-8">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                  title="Remover campo"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {fields.length === 0 && (
            <div className="text-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
              <p>Nenhum campo configurado ainda.</p>
              <p className="text-sm mt-1">Clique em "Novo Campo" para começar.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSaving} className="gap-2">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar Template
          </Button>
        </div>
      </form>
    </div>
  );
}
