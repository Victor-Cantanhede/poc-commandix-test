# Roadmap

## Visão Geral

Este documento representa o estado atual do desenvolvimento.

Os módulos devem ser implementados incrementalmente.

Cada módulo deve ser concluído e validado antes do próximo.

---

# Fase 01 — Fundação Técnica

## Monorepo

Status: ✅ Concluído

Itens:

* pnpm workspaces
* apps/backend
* apps/frontend
* packages/shared-types

---

## Infraestrutura

Status: ✅ Concluído

Itens:

* Docker
* Docker Compose Dev
* PostgreSQL
* Variáveis de ambiente

---

## Qualidade

Status: ✅ Concluído

Itens:

* ESLint
* Prettier
* TypeScript Strict

---

## Prisma

Status: ✅ Concluído

Itens:

* Setup Prisma
* PostgreSQL Integration

---

# Fase 02 — Autenticação

Status: ✅ Concluído

Escopo:

* Login
* JWT
* Refresh Token
* Guards
* RBAC

---

# Fase 03 — Tenant

Status: ✅ Concluído

Escopo:

* Tenant Entity
* Tenant Repository
* Tenant Services
* Tenant Use Cases
* Tenant Controller

Critério de conclusão:

* CRUD necessário para a POC funcionando
* Integração com Auth validada

---

# Fase 04 — Template

Status: ✅ Concluído

Escopo:

* Template Entity
* Campos Dinâmicos
* CRUD de Template

Critério de conclusão:

* Tenant possuir template ativo
* Gestão dos campos funcionando

---

# Fase 05 — Contract

Status: ✅ Concluído

Escopo:

* Criação de contratos
* Snapshot do template
* Alteração de status
* Listagem
* Filtros
* Paginação

Critério de conclusão:

* Fluxo completo de contrato funcionando

---

# Fase 06 — History

Status: ✅ Concluído

Escopo:

* Auditoria
* Histórico de alterações
* Consulta de histórico

Critério de conclusão:

* Todas as alterações relevantes registradas

---

# Checklist Arquitetural

Antes de concluir qualquer módulo verificar:

* [x] Nenhum any introduzido
* [x] Nenhum CSS inline
* [x] Nenhuma regra de negócio em controllers
* [x] Prisma apenas em repositories
* [x] Estrutura modular respeitada
* [x] TailwindCSS utilizado
* [x] ESLint sem erros
* [x] TypeScript sem erros
* [x] Build funcionando

---

# Próxima Tarefa

Implementar módulo Contract.
