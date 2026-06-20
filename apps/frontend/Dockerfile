FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json apps/frontend/
COPY packages/shared-types/package.json packages/shared-types/

RUN pnpm install --frozen-lockfile

COPY apps/frontend apps/frontend
COPY packages/shared-types packages/shared-types
COPY tsconfig.base.json .

RUN pnpm -r run build

# Development image with hot-reload support
FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY --from=builder /app /app

WORKDIR /app/apps/frontend

EXPOSE 5173

CMD ["pnpm", "run", "dev"]
