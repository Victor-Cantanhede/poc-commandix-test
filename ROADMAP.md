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

Status: 🔄 Em andamento

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

Status: ⬜ Não iniciado

Escopo:

* Template Entity
* Campos Dinâmicos
* CRUD de Template

Critério de conclusão:

* Tenant possuir template ativo
* Gestão dos campos funcionando

---

# Fase 05 — Contract

Status: ⬜ Não iniciado

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

Status: ⬜ Não iniciado

Escopo:

* Auditoria
* Histórico de alterações
* Consulta de histórico

Critério de conclusão:

* Todas as alterações relevantes registradas

---

# Checklist Arquitetural

Antes de concluir qualquer módulo verificar:

* [ ] Nenhum any introduzido
* [ ] Nenhum CSS inline
* [ ] Nenhuma regra de negócio em controllers
* [ ] Prisma apenas em repositories
* [ ] Estrutura modular respeitada
* [ ] TailwindCSS utilizado
* [ ] ESLint sem erros
* [ ] TypeScript sem erros
* [ ] Build funcionando

---

# Próxima Tarefa

Implementar módulo Tenant.
