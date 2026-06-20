import { HistoryEntity } from '../entities/history.entity';
import { LogHistoryDto } from '../dtos/log-history.dto';
import { HistoryResponseDto } from '../dtos/history-response.dto';

export interface IHistoryRepository {
  create(tenantId: string, data: LogHistoryDto): Promise<HistoryEntity>;
  findByContractId(tenantId: string, contractId: string): Promise<HistoryResponseDto[]>;
}
