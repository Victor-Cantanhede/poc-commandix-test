import { Module } from '@nestjs/common';
import { TemplateController } from './controllers/template.controller';
import { GetTemplateUseCase } from './application/use-cases/get-template.use-case';
import { UpdateTemplateUseCase } from './application/use-cases/update-template.use-case';
import { TemplateService } from './services/template.service';
import { ITemplateRepository } from './interfaces/template-repository.interface';
import { PrismaTemplateRepository } from './repositories/prisma-template.repository';
import { PrismaModule } from '../../core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TemplateController],
  providers: [
    GetTemplateUseCase,
    UpdateTemplateUseCase,
    TemplateService,
    {
      provide: ITemplateRepository,
      useClass: PrismaTemplateRepository,
    },
  ],
  exports: [TemplateService],
})
export class TemplateModule {}
