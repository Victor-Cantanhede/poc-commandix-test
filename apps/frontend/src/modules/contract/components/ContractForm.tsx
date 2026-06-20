import React, { useState } from 'react';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Label } from '@/shared/components/ui/label';
import { Checkbox } from '@/shared/components/ui/checkbox';

interface ContractFormProps {
  schema: any[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  isLoading?: boolean;
  readOnly?: boolean;
}

export function ContractForm({
  schema,
  initialData = {},
  onSubmit,
  isLoading,
  readOnly,
}: ContractFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schema.map((field) => (
          <div key={field.name} className="flex flex-col space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {field.name} {field.required && <span className="text-red-500">*</span>}
            </Label>

            {field.type === 'text' && (
              <Input
                type="text"
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
                disabled={readOnly}
              />
            )}

            {field.type === 'number' && (
              <Input
                type="number"
                value={formData[field.name] || ''}
                onChange={(e) =>
                  handleChange(field.name, e.target.value ? Number(e.target.value) : '')
                }
                required={field.required}
                disabled={readOnly}
              />
            )}

            {field.type === 'date' && (
              <Input
                type="date"
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
                disabled={readOnly}
              />
            )}

            {field.type === 'boolean' && (
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  checked={!!formData[field.name]}
                  onCheckedChange={(checked) => handleChange(field.name, checked === true)}
                  disabled={readOnly}
                />
                <span className="text-sm text-muted-foreground">Sim</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {!readOnly && (
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Contrato'}
          </Button>
        </div>
      )}
    </form>
  );
}
