import { useEffect, useState } from 'react';
import { contractService } from '../services/contract.service';
import { ContractHistory as IContractHistory } from '../types/contract.types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ContractHistoryProps {
  contractId: string;
}

export function ContractHistory({ contractId }: ContractHistoryProps) {
  const [history, setHistory] = useState<IContractHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [contractId]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await contractService.getHistory(contractId);
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'CREATED':
        return 'Contrato Criado';
      case 'STATUS_CHANGED':
        return 'Status Alterado';
      case 'UPDATED_FIELD':
        return 'Campo Atualizado';
      default:
        return action;
    }
  };

  const formatValue = (val: unknown) => {
    if (val === null || val === undefined) return 'Vazio';
    if (typeof val === 'object') return JSON.stringify(val);
    if (typeof val === 'boolean') return val ? 'Sim' : 'Não';
    return String(val);
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <p className="text-sm text-muted-foreground">Carregando histórico...</p>
      ) : history.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum histórico encontrado.</p>
      ) : (
        history.map((record) => (
          <Card key={record.id} className="w-full bg-card">
            <CardHeader className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-md">{getActionLabel(record.action)}</CardTitle>
                  <CardDescription className="text-xs">
                    por {record.user?.name || 'Usuário Desconhecido'} em{' '}
                    {format(new Date(record.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            {(record.action === 'UPDATED_FIELD' || record.action === 'STATUS_CHANGED') && (
              <CardContent className="py-0 pb-4 text-sm">
                {record.field && (
                  <p>
                    <span className="font-semibold">Campo:</span> {record.field}
                  </p>
                )}
                <div className="mt-2 grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-md">
                  <div>
                    <span className="text-muted-foreground text-xs block mb-1">De</span>
                    <span className="font-medium">{formatValue(record.oldValue)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs block mb-1">Para</span>
                    <span className="font-medium text-primary">{formatValue(record.newValue)}</span>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))
      )}
    </div>
  );
}
