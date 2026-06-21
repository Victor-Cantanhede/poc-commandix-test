# Commandix - Gestão de Contratos (SaaS Multi-tenant)

Esta é a POC (Proof of Concept) do módulo central da plataforma Commandix, um sistema SaaS focado na gestão dinâmica de contratos e templates, com um isolamento rígido (multi-tenancy) e trilha de auditoria completa.

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
- **[Docker](https://docs.docker.com/get-docker/)** e **[Docker Compose](https://docs.docker.com/compose/install/)** (Obrigatório para o banco de dados e execução em contêineres).
- **[Node.js](https://nodejs.org/)** v20 ou superior (Obrigatório apenas para o Modo 2: Desenvolvimento Local).
- **[pnpm](https://pnpm.io/)** v9+ (Recomendado) ou **npm** (Opcional, utilizado apenas no Modo 2).

---

## 🚀 Instruções de Setup

Para facilitar a execução e testes da aplicação, preparamos duas formas de rodar o projeto. Você pode escolher a que melhor atende à sua necessidade no momento.

### 1. Clonando o Repositório e Variáveis de Ambiente

Independente da abordagem escolhida, inicie clonando o projeto:

```bash
git clone https://github.com/Victor-Cantanhede/poc-commandix-test.git
cd poc-commandix-test
```

*(Opcional)* Existe um arquivo `.env.example` na raiz e nos diretórios dos apps. Se desejar, copie-os para um novo arquivo `.env`. Por padrão, o Docker já carrega as variáveis necessárias.

---

### Modo 1: Avaliação e Testes (Stack Completa via Docker)
**Recomendado para avaliadores e testes de ponta a ponta sem instalar dependências locais.**

Neste modo, o Docker cuidará de absolutamente tudo: subir o PostgreSQL, rodar as migrations, popular a base inicial (Seed) e iniciar a API (porta 3000) e o Frontend (porta 5173).

Execute na raiz do projeto:
```bash
docker compose up -d --build
```
> O Frontend estará acessível em `http://localhost:5173` e a API em `http://localhost:3000/api`.

**Dica:** Caso deseje recomeçar com o banco de dados limpo para re-executar o Seed do zero, basta derrubar os volumes residuais antes de subir novamente:
```bash
docker compose down -v
docker compose up -d --build
```

---

### Modo 2: Desenvolvimento Local (Hot-Reload)
**Recomendado para o trabalho diário do Desenvolvedor.**

Neste modo, apenas o banco de dados roda no Docker. O frontend e backend rodarão nativamente na sua máquina para refletir as alterações de código em tempo real.

#### Passo 1: Subir o Banco de Dados (PostgreSQL)
Mantenha um terminal aberto na raiz do projeto e execute:
```bash
docker compose -f docker-compose.dev.yml up -d
```
*(Isso iniciará o Postgres de desenvolvimento mapeado na porta `5432`)*.

#### Passo 2: Instalar as Dependências (Monorepo)
Ainda no diretório raiz, instale os pacotes:

**Para usuários de `pnpm` (Recomendado):**
```bash
pnpm install
```

**Para usuários de `npm`:**
```bash
npm install
```

#### Passo 3: Migrations e Prisma Client
Aplique as estruturas das tabelas no banco de dados e gere as tipagens do Prisma.

**Com `pnpm` (A partir da raiz):**
```bash
pnpm --filter backend run db:deploy
pnpm --filter backend run db:generate
```

**Com `npm`:**
Como o monorepo é estruturado para o pnpm, ao usar o npm puro, entre na pasta do backend:
```bash
cd apps/backend
npm run db:deploy
npm run db:generate
cd ../../
```

#### Passo 4: Popular o Banco (Seed)
Para facilitar o desenvolvimento, popule a sua base local com os dados de demonstração utilizando o `npx tsx` (executando direto da raiz):

```bash
npx tsx apps/backend/src/seed.ts
```

#### Passo 5: Iniciar as Aplicações
Agora você pode rodar o Frontend e o Backend localmente. Sugerimos abrir dois terminais diferentes:

**Iniciando o Backend (Porta 3000):**
```bash
# Com pnpm:
pnpm --filter backend run dev

# Com npm (A partir da raiz):
cd apps/backend && npm run dev
```

**Iniciando o Frontend (Porta 5173):**
```bash
# Com pnpm:
pnpm --filter frontend run dev

# Com npm (A partir da raiz):
cd apps/frontend && npm run dev
```

---

## 🔑 Acesso ao Seed (Credenciais Padrão)

O script de Seed (executado automaticamente no Modo 1 ou manualmente no Modo 2) proverá o banco de dados com 2 tenants, 3 usuários e 5 contratos para facilitar a avaliação.

**Tenant 1 (TechCorp)**
- **Admin:** `admin@techcorp.com` | Senha: `password123`
- **Viewer:** `viewer@techcorp.com` | Senha: `password123`

**Tenant 2 (GlobalLogistics)**
- **Admin:** `admin@globallog.com` | Senha: `password123`

*(Atenção: O sistema garante arquiteturalmente que um usuário do Tenant 1 jamais consiga ler ou alterar contratos do Tenant 2).*

---

## 🏗️ Defesa Arquitetural

Para construir uma POC madura, legível e manutenível, tomei algumas decisões chave:

### 1. Modular Monolith no NestJS
Em vez de fragmentar a aplicação prematuramente em microsserviços (o que traria um custo alto de infraestrutura para uma POC), optei pelo **Modular Monolith**. 
Módulos como `AuthModule`, `TenantModule`, `ContractModule` e `HistoryModule` são totalmente isolados e se comunicam através de interfaces e Use Cases (Clean Architecture). Essa decisão preserva a separação de responsabilidades (Separation of Concerns) e facilita uma eventual extração futura.

### 2. Isolamento Multi-tenant via Prisma (Repository Pattern)
A segurança dos dados é a premissa #1 desta POC. O NestJS intercepta a autenticação e injeta o `tenantId` no objeto do request. Esse ID flui das Controllers para os Use Cases e, por fim, para as classes Repository.
**Decisão crucial:** Nenhum `Service` ou `Controller` chama o Prisma diretamente. Apenas os Repositories conhecem o Prisma, e todas as queries contêm o filtro obrigatório `where: { tenantId }`.

### 3. Schemas de Contrato Dinâmico (JSONB + Snapshots)
Para permitir que o Admin crie templates configuráveis, utilizei o campo `schema` como `Json` (salvo como JSONB no PostgreSQL).
**Problema resolvido:** Alterações em templates *não* devem alterar retroativamente os contratos gerados.
**Solução:** Quando um contrato é gerado a partir do template, o sistema salva não apenas o `payload` (dados preenchidos), mas também um `templateSnapshot`. O contrato passa a viver isolado da sua planta-matriz original, garantindo a validade jurídica/histórica de como ele era no momento de sua criação.

### 4. Busca Flexível (Prisma Path Searching)
A listagem de contratos permite a busca por valor de campo dinâmico. Foi utilizada a capacidade nativa do PostgreSQL e do Prisma para buscar chaves específicas dentro de colunas JSONB (`string_contains`), assegurando uma consulta paginada de alta performance.

---

Foi um grande desafio e prazer arquitetar esta solução seguindo os princípios rigorosos de **SOLID**, sem *overengineering* e visando 100% o que gera valor. Fico à disposição para qualquer dúvida ou "grill session" sobre o código!
