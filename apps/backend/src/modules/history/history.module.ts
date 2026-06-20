import { Module } from '@nestjs/common';
import { HistoryController } from './controllers/history.controller';
import { HistoryService } from './services/history.service';
import { HistoryRepository } from './repositories/history.repository';

@Module({
  controllers: [HistoryController],
  providers: [
    HistoryService,
    {
      provide: 'IHistoryRepository',
      useClass: HistoryRepository,
    },
  ],
  exports: [HistoryService],
})
export class HistoryModule {}
