import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/Button';
import { contractService } from '../services/contract.service';
import { Contract, ContractStatus } from '../types/contract.types';
import { ContractForm } from '../components/ContractForm';
import { templateService } from '@/modules/template/services/template.service';
import { Card, CardContent } from '@/shared/components/ui/card';
import { toast } from 'sonner';

export function ContractDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id;
  const [contract, setContract] = useState<Contract | null>(null);
  const [templateSchema, setTemplateSchema] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isNew) {
      loadTemplate();
    } else {
      loadContract();
    }
  }, [id]);

  const loadTemplate = async () => {
    try {
      const template = await templateService.getTemplate();
      if (!template || !template.schema || template.schema.length === 0) {
        toast.warning('Configure um Template primeiro para criar contratos.');
        navigate('/template');
        return;
      }
      setTemplateSchema(template.schema);
    } catch (error) {
      toast.error('Erro ao carregar o template');
    }
  };

  const loadContract = async () => {
    try {
      const data = await contractService.findById(id!);
      setContract(data);
      setTemplateSchema(data.templateSnapshot);
    } catch (error) {
      toast.error('Contrato não encontrado');
      navigate('/contracts');
    }
  };

  const handleSubmit = async (formData: Record<string, any>) => {
    setIsLoading(true);
    try {
      if (isNew) {
        const newContract = await contractService.create(formData);
        toast.success('Contrato criado com sucesso!');
        navigate(`/contracts/${newContract.id}`);
      } else {
        await contractService.update(id!, formData);
        toast.success('Contrato atualizado com sucesso!');
        loadContract();
      }
    } catch (error) {
      toast.error('Erro ao salvar contrato');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeStatus = async (status: ContractStatus) => {
    try {
      await contractService.changeStatus(id!, status);
      toast.success('Status alterado com sucesso!');
      loadContract();
    } catch (error) {
      toast.error('Erro ao alterar status');
    }
  };

  const readOnly = !isNew && contract?.status !== 'DRAFT';

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isNew ? 'Novo Contrato' : 'Detalhes do Contrato'}
          </h1>
          {contract && (
            <p className="text-muted-foreground mt-1">
              Status:{' '}
              <span className="font-semibold text-foreground">
                {contract.status === 'DRAFT' ? 'Rascunho' : contract.status === 'ACTIVE' ? 'Ativo' : 'Encerrado'}
              </span>
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          {!isNew && contract?.status === 'DRAFT' && (
            <Button onClick={() => handleChangeStatus(ContractStatus.ACTIVE)} className="bg-green-600 hover:bg-green-700">
              Ativar Contrato
            </Button>
          )}
          {!isNew && contract?.status === 'ACTIVE' && (
            <Button onClick={() => handleChangeStatus(ContractStatus.CLOSED)} variant="destructive">
              Encerrar Contrato
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate('/contracts')}>
            Voltar
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          {templateSchema.length > 0 ? (
            <ContractForm
              schema={templateSchema}
              initialData={contract?.payload}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              readOnly={readOnly}
            />
          ) : (
            <p className="text-center text-muted-foreground">Carregando formulário...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
