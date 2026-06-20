import { Module } from '@nestjs/common';
import { ContractService } from './services/contract.service';
import { ContractController } from './controllers/contract.controller';
import { PrismaContractRepository } from './repositories/prisma-contract.repository';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { TemplateModule } from '../template/template.module';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [PrismaModule, TemplateModule, HistoryModule],
  controllers: [ContractController],
  providers: [
    ContractService,
    {
      provide: 'IContractRepository',
      useClass: PrismaContractRepository,
    },
  ],
  exports: [ContractService],
})
export class ContractModule {}
