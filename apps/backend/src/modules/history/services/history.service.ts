import { Injectable, Inject } from '@nestjs/common';
import { IHistoryRepository } from '../interfaces/history.repository.interface';
import { LogHistoryDto } from '../dtos/log-history.dto';
import { HistoryResponseDto } from '../dtos/history-response.dto';

@Injectable()
export class HistoryService {
  constructor(
    @Inject('IHistoryRepository')
    private readonly historyRepository: IHistoryRepository,
  ) {}

  async log(tenantId: string, data: LogHistoryDto): Promise<void> {
    await this.historyRepository.create(tenantId, data);
  }

  async getContractHistory(tenantId: string, contractId: string): Promise<HistoryResponseDto[]> {
    return this.historyRepository.findByContractId(tenantId, contractId);
  }
}
