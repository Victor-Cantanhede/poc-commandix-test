# CONSTITUIÇÃO ARQUITETURAL

Este documento rege todas as implementações neste projeto. Toda nova feature deve aderir estritamente às regras aqui estabelecidas.
Em caso de dúvida ou conflito com instruções isoladas, **ESTE DOCUMENTO PREVALECE**.

## FILOSOFIA DO PROJETO
1. **É uma POC, mas com qualidade:** Deve ser simples, modular, legível, manutenível e testável.
2. **Prioridades:** Legibilidade > Simplicidade > Manutenibilidade > Escalabilidade.
3. **Sem overengineering:** Nunca implementar soluções mais complexas que o requisito exige.
4. **Princípios Base:** SOLID, Clean Code, Separation of Concerns.

## TYPESCRIPT
1. `strict` mode habilitado obrigatoriamente.
2. Utilização rigorosa de interfaces, types, generics e enums.
3. **PROIBIDO:** `any`, `ts-ignore`, `ts-nocheck` (Salvo exceção documentada em integração externa complexa).

## BACKEND (NestJS + Prisma + PostgreSQL)
1. **Arquitetura:** MODULAR MONOLITH.
2. **Estrutura Proibida:** Pastas globais na raiz (`src/controllers`, `src/services`, etc.).
3. **Estrutura Obrigatória de Módulo:**
   ```
   module-name/
     controllers/
     application/
       use-cases/
     dtos/
     entities/
     interfaces/
     repositories/
     services/
     validators/
     module-name.module.ts
   ```
4. **Responsabilidades:**
   - *Controllers:* Apenas HTTP, nunca contêm regras de negócio ou queries SQL. Não chamam Prisma diretamente.
   - *Application/Use-Cases:* Orquestração dos fluxos.
   - *Services:* Regras de negócio puras. Máximo 300 linhas.
   - *Repositories:* Única camada permitida para usar o Prisma ORM (Acesso a dados).
   - *DTOs:* Contratos rígidos de I/O. **OBRIGATÓRIO:** Todo DTO de entrada deve utilizar decorators do `class-validator` e a aplicação deve possuir `ValidationPipe` global.

## BANCO DE DADOS E PRISMA
1. **Migrations:** O versionamento do banco de dados deve ser feito estritamente utilizando `prisma migrate dev` (desenvolvimento) e `prisma migrate deploy` (produção).
2. **PROIBIDO:** Utilizar `prisma db push` (exceto em fases de prototipação isolada que não requeiram versão, porém na POC oficial é **proibido**).


## FRONTEND (React + Vite + TailwindCSS + shadcn/ui)
1. **Estrutura de Pastas:** `src/app/`, `src/modules/`, `src/shared/`.
2. **Estrutura de Módulo Frontend:** `components/`, `pages/`, `services/`, `hooks/`, `types/`.
3. **Estilização:**
   - **OBRIGATÓRIO:** Utilizar os componentes base do `shadcn/ui` para a criação de elementos genéricos (exceções apenas em casos raríssimos que exijam UI completamente customizada).
   - **OBRIGATÓRIO:** TailwindCSS com utility classes e tema escuro como padrão configurado via variáveis CSS.
   - **PROIBIDO:** CSS inline (`style={{}}`) ou arquivos CSS específicos por componente.
4. **Comunicação e Compartilhamento:**
   - Módulo `shared` serve APENAS genéricos (UI components como Button, Input, Modal implementados com shadcn/ui em `shared/components/`). Proibido ter regra de negócio.
   - Toda chamada HTTP **DEVE** ficar na pasta `services/` do módulo. Proibido chamadas espalhadas.
   - Imports absolutos configurados via alias (`@/*`).

## QUALIDADE & NOMENCLATURA
1. Nomenclatura:
   - Arquivos: `kebab-case`
   - Classes: `PascalCase`
   - Variáveis: `camelCase`
   - Interfaces: `I` prefixado apenas se clarificar.
2. Checklist de Sucesso (Refatore se qualquer um for "SIM"):
   - Existe any?
   - Existe CSS inline?
   - Existe regra de negócio em controller?
   - Existe Prisma fora do repository?
   - Existe código duplicado?
   - Existe módulo fora da arquitetura?
   - Algum DTO de entrada está sem `class-validator`?
   - Foi utilizado `db push` no lugar de gerar uma nova migration?
