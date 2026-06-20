# TAREFA

Você deve criar um documento chamado:

AGENTS.md

na raiz do projeto.

Este documento será a constituição arquitetural definitiva do projeto.

Todas as implementações futuras devem seguir obrigatoriamente estas regras.

As regras abaixo possuem prioridade máxima.

Nenhuma funcionalidade nova pode violar qualquer uma delas.

Se existir conflito entre uma solicitação futura e este documento, este documento deve prevalecer.

---

# FILOSOFIA DO PROJETO

Este projeto é uma POC.

Porém:

POC NÃO significa código descartável.

POC NÃO significa ignorar arquitetura.

POC NÃO significa ignorar boas práticas.

A POC deve ser:

* simples
* modular
* legível
* manutenível
* testável

Sem overengineering.

Sem código improvisado.

---

# REGRAS GERAIS

## Regra 01

Sempre priorizar:

1. Legibilidade
2. Simplicidade
3. Manutenibilidade
4. Escalabilidade

---

## Regra 02

Nunca implementar soluções mais complexas do que o requisito exige.

---

## Regra 03

Toda implementação deve seguir SOLID.

---

## Regra 04

Toda implementação deve seguir Clean Code.

---

## Regra 05

Toda implementação deve seguir Separation of Concerns.

---

# TYPESCRIPT

## Proibido

* any
* ts-ignore
* ts-nocheck

---

## Permitido

Somente em integrações externas extremamente complexas.

Nestes casos:

1. justificar o motivo;
2. documentar a exceção.

---

## Obrigatório

Utilizar:

* interfaces
* types
* generics
* enums

quando apropriado.

---

## Obrigatório

strict mode habilitado.

---

# BACKEND

Stack:

* NestJS
* Prisma
* PostgreSQL

---

# ARQUITETURA BACKEND

O backend deve seguir:

MODULAR MONOLITH

---

# PROIBIDO

Estruturas globais como:

src/controllers
src/services
src/repositories
src/entities

---

# OBRIGATÓRIO

Toda funcionalidade deve existir dentro de um módulo.

Exemplo:

src/modules/auth

src/modules/tenant

src/modules/contracts

---

# ESTRUTURA OBRIGATÓRIA DE MÓDULO

Cada módulo deve seguir:

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

---

# RESPONSABILIDADES

Controllers:

* apenas HTTP
* nunca regra de negócio

---

Application:

* orquestração de casos de uso

---

Services:

* regras de negócio

---

Repositories:

* acesso a dados

---

DTOs:

* contratos de entrada e saída

---

Interfaces:

* contratos e abstrações

---

Entities:

* representação do domínio

---

# PROIBIDO

Controller chamando Prisma diretamente.

---

# PROIBIDO

Controller contendo regra de negócio.

---

# PROIBIDO

Controller contendo queries.

---

# PROIBIDO

Repository contendo regra de negócio.

---

# PROIBIDO

Services gigantes.

Máximo recomendado:

300 linhas.

Acima disso avaliar extração.

---

# PRISMA

## Obrigatório

Prisma apenas dentro da camada Repository.

---

## Proibido

Prisma dentro:

* controller
* service
* dto
* entity

---

# FRONTEND

Stack:

* React
* Vite
* TypeScript
* TailwindCSS

---

# PROIBIDO

CSS inline.

Exemplo proibido:

style={{}}

---

# PROIBIDO

Arquivos CSS específicos por componente.

---

# OBRIGATÓRIO

Utilizar TailwindCSS.

---

# OBRIGATÓRIO

Utilizar utility classes.

---

# OBRIGATÓRIO

Componentização.

---

# ESTRUTURA FRONTEND

src/

app/

modules/

shared/

---

# SHARED

Somente:

* Button
* Input
* Modal
* Spinner
* Dialog
* componentes genéricos

---

# PROIBIDO

Regras de negócio dentro de shared.

---

# MÓDULOS FRONTEND

Cada módulo deve possuir:

components/

pages/

services/

hooks/

types/

---

# PROIBIDO

Chamadas HTTP espalhadas.

---

# OBRIGATÓRIO

Toda chamada HTTP deve ficar em services.

---

# NOMENCLATURA

Arquivos:

kebab-case

---

Classes:

PascalCase

---

Variáveis:

camelCase

---

Interfaces:

Prefixo I apenas quando agregar clareza.

---

# IMPORTS

Sempre utilizar imports absolutos configurados por aliases.

---

# QUALIDADE

Antes de finalizar qualquer implementação:

1. verificar arquitetura
2. verificar tipagem
3. verificar responsabilidades
4. verificar acoplamento
5. verificar uso de Tailwind
6. verificar existência de any

---

# CHECKLIST OBRIGATÓRIO

Antes de concluir qualquer tarefa responder internamente:

* Existe any?
* Existe CSS inline?
* Existe regra de negócio em controller?
* Existe Prisma fora do repository?
* Existe código duplicado?
* Existe módulo fora da arquitetura definida?

Se alguma resposta for SIM:

refatorar antes de concluir.