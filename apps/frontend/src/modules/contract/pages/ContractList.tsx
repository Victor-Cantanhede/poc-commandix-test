import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { contractService } from '../services/contract.service';
import { Contract, ContractQuery, ContractStatus, PaginatedResult } from '../types/contract.types';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/shared/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { DateRange } from 'react-day-picker';

export function ContractList() {
  const navigate = useNavigate();
  const [data, setData] = useState<PaginatedResult<Contract> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState<ContractQuery>({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  const fetchContracts = async () => {
    setIsLoading(true);
    try {
      const response = await contractService.findAll(query);
      setData(response);
    } catch (error) {
      toast.error('Erro ao buscar contratos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [query.page, query.status, query.search, query.startDate, query.endDate]);

  const handleStatusChange = (value: string) => {
    setQuery((prev) => ({ ...prev, status: value, page: 1 }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: query.startDate ? new Date(query.startDate + 'T12:00:00') : undefined,
    to: query.endDate ? new Date(query.endDate + 'T12:00:00') : undefined,
  });

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);

    const fromStr = range?.from ? format(range.from, 'yyyy-MM-dd') : '';
    const toStr = range?.to ? format(range.to, 'yyyy-MM-dd') : '';

    setQuery((prev) => ({ ...prev, startDate: fromStr, endDate: toStr, page: 1 }));
  };

  const handleClearFilters = () => {
    setDateRange(undefined);
    setQuery({ page: 1, limit: 10, search: '', status: '', startDate: '', endDate: '' });
  };

  const hasFilters = Boolean(query.search || query.status || query.startDate || query.endDate);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
          <p className="text-muted-foreground">Gerencie os contratos da sua organização.</p>
        </div>
        <Button onClick={() => navigate('/contracts/new')}>Novo Contrato</Button>
      </div>

      <div className="flex space-x-4 items-center bg-card p-4 rounded-lg border">
        <div className="flex-1">
          <Input
            placeholder="Buscar em contratos..."
            value={query.search || ''}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-2 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-[260px] justify-start text-left font-normal',
                  !dateRange?.from && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'dd LLL, y', { locale: ptBR })} -{' '}
                      {format(dateRange.to, 'dd LLL, y', { locale: ptBR })}
                    </>
                  ) : (
                    format(dateRange.from, 'dd LLL, y', { locale: ptBR })
                  )
                ) : (
                  <span>Período de Criação</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Select
          value={query.status || 'ALL'}
          onValueChange={(val) => handleStatusChange(val === 'ALL' ? '' : val)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todos os Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos os Status</SelectItem>
            <SelectItem value="DRAFT">Rascunho</SelectItem>
            <SelectItem value="ACTIVE">Ativo</SelectItem>
            <SelectItem value="CLOSED">Encerrado</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="icon" onClick={handleClearFilters} title="Limpar Filtros">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="bg-card rounded-lg border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Carregando...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Nenhum contrato encontrado.
                  </TableCell>
                </TableRow>
              )}
              {data?.data.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.id.slice(0, 8)}...</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        contract.status === 'ACTIVE'
                          ? 'default'
                          : contract.status === 'DRAFT'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {contract.status === 'DRAFT'
                        ? 'Rascunho'
                        : contract.status === 'ACTIVE'
                          ? 'Ativo'
                          : 'Encerrado'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(contract.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/contracts/${contract.id}`)}
                    >
                      Visualizar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            disabled={query.page === 1}
            onClick={() => setQuery((p) => ({ ...p, page: (p.page || 1) - 1 }))}
          >
            Anterior
          </Button>
          <span className="flex items-center px-4 text-sm">
            Página {data.page} de {data.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={query.page === data.totalPages}
            onClick={() => setQuery((p) => ({ ...p, page: (p.page || 1) + 1 }))}
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  );
}
