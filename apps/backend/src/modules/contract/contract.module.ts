import { Module } from '@nestjs/common';
import { ContractService } from './services/contract.service';
import { ContractController } from './controllers/contract.controller';
import { PrismaContractRepository } from './repositories/prisma-contract.repository';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { TemplateModule } from '../template/template.module';
import { HistoryModule } from '../history/history.module';
import { CreateContractUseCase } from './application/use-cases/create-contract.use-case';
import { UpdateContractUseCase } from './application/use-cases/update-contract.use-case';
import { ChangeStatusUseCase } from './application/use-cases/change-status.use-case';
import { ListContractsUseCase } from './application/use-cases/list-contracts.use-case';
import { FindContractUseCase } from './application/use-cases/find-contract.use-case';

@Module({
  imports: [PrismaModule, TemplateModule, HistoryModule],
  controllers: [ContractController],
  providers: [
    ContractService,
    CreateContractUseCase,
    UpdateContractUseCase,
    ChangeStatusUseCase,
    ListContractsUseCase,
    FindContractUseCase,
    {
      provide: 'IContractRepository',
      useClass: PrismaContractRepository,
    },
  ],
  exports: [ContractService],
})
export class ContractModule {}
