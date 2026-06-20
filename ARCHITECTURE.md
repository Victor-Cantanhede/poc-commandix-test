# Architecture

## Visão Geral

Este projeto é uma Prova de Conceito (POC) para gestão de contratos multi-tenant.

O objetivo principal é validar o domínio de negócio, os fluxos da aplicação e a arquitetura proposta, priorizando:

- simplicidade;
- legibilidade;
- manutenibilidade;
- velocidade de entrega;
- baixo acoplamento.

A aplicação NÃO deve conter overengineering.

Toda solução deve ser a mais simples possível que atenda corretamente aos requisitos.

---

# Stack Tecnológica

## Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication

## Frontend

- React
- Vite
- TypeScript
- TailwindCSS
- shadcn/ui (Tema Escuro Padrão)

## Infraestrutura

- Docker
- Docker Compose
- pnpm Workspaces

---

# Arquitetura Geral

O projeto segue o padrão:

Monorepo + Modular Monolith

Estrutura principal:

```text
apps/
  backend/
  frontend/

packages/
  shared-types/
```

---

# Backend

## Estilo Arquitetural

Modular Monolith.

Não utilizar arquitetura baseada em camadas globais.

Proibido:

```text
src/controllers
src/services
src/repositories
src/entities
```

Todos os elementos devem existir dentro de módulos de domínio.

---

## Estrutura de Módulo

```text
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

---

## Responsabilidades

### Controllers

Responsáveis apenas por:

- HTTP
- Request
- Response
- Status Codes

Nunca conter regras de negócio.

---

### Application / Use Cases

Responsáveis por:

- orquestração;
- coordenação de fluxo;
- chamadas entre serviços.

---

### Services

Responsáveis por:

- regras de negócio;
- validações de domínio.

---

### Repositories

Responsáveis exclusivamente por:

- acesso ao banco;
- Prisma.

---

### DTOs

Responsáveis por:

- contratos de entrada;
- contratos de saída.

---

### Interfaces

Responsáveis por:

- abstrações;
- contratos internos.

---

### Entities

Representação do domínio.

Sem dependência de HTTP.

Sem dependência de Prisma.

---

# Multi-Tenancy

Modelo:

Pool-Based Multi-Tenant

Estratégia:

```text
tenantId
```

presente em todas as entidades relevantes.

Não utilizar:

- database per tenant;
- schema per tenant;
- row level security.

O isolamento deve ocorrer na aplicação.

---

# Módulos do Sistema

## Auth

Responsável por:

- login;
- refresh token;
- geração de JWT;
- validação de sessão;
- autorização.

Status:

IMPLEMENTADO

---

## Tenant

Responsável por:

- criação de tenants;
- consulta de tenants;
- gerenciamento do tenant atual.

Status:

PENDENTE

---

## Template

Responsável por:

- definição do contrato padrão;
- gerenciamento dos campos dinâmicos.

Cada tenant possui apenas um template ativo.

Status:

PENDENTE

---

## Contract

Responsável por:

- criação de contratos;
- atualização de contratos;
- mudança de status;
- filtros;
- paginação.

Status:

PENDENTE

---

## History

Responsável por:

- auditoria;
- trilha de alterações;
- histórico dos contratos.

Status:

PENDENTE

---

# Banco de Dados

## Estratégia de Templates

Cada Tenant possui:

```text
1 Template Ativo
```

Apenas um template por vez.

---

## Snapshot

Ao criar um contrato:

- copiar o schema do template;
- armazenar dentro do contrato.

Objetivo:

Garantir que contratos antigos não sejam afetados por alterações futuras do template.

---

## Campos Dinâmicos

Utilizar JSONB.

Template:

```text
schema
```

Contrato:

```text
payload
```

---

# Auditoria

Estratégia simples.

Sem:

- Event Sourcing
- CQRS
- Kafka
- RabbitMQ

Toda alteração relevante deve gerar registro em tabela própria de histórico.

---

# Busca

Implementação simples.

Utilizar filtros nativos do Prisma.

Exemplos:

- contains
- equals
- status
- datas

Não implementar:

- ElasticSearch
- OpenSearch
- Full Text Search

---

# Frontend

Estrutura:

```text
src/

  app/

  modules/

  shared/
```

---

## Shared

Somente componentes genéricos baseados em shadcn/ui:

- Button
- Input
- Modal / Dialog
- Spinner
- Card
- Table

Nenhuma regra de negócio.

---

## Modules

Cada módulo deve possuir:

```text
components/
pages/
services/
hooks/
types/
```

---

# Estilização

Obrigatório:

- TailwindCSS
- shadcn/ui (para todos os componentes base e layout)
- Tema escuro como padrão (variáveis CSS)

Proibido:

- CSS inline
- style={{}}
- lógica de estilos espalhada

---

# Comunicação Frontend

Toda comunicação HTTP deve ficar em:

```text
services/
```

Nunca diretamente em componentes.

---

# Critérios de Simplicidade

Sempre escolher:

1. Simplicidade
2. Clareza
3. Manutenibilidade
4. Escalabilidade

A escalabilidade futura nunca deve aumentar significativamente a complexidade atual.

---

# Status Atual

Setup Base: Concluído

Auth: Concluído

Tenant: Em andamento

Template: Não iniciado

Contract: Não iniciado

History: Não iniciado
