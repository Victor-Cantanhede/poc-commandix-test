FROM node:20-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/
COPY packages/shared-types/package.json packages/shared-types/

# Install dependencies for the workspace
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/backend apps/backend
COPY packages/shared-types packages/shared-types
COPY tsconfig.base.json .

# Build backend and dependencies
RUN pnpm -r run build

# Production image
FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/packages/shared-types/package.json ./packages/shared-types/

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built code
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/packages/shared-types/dist ./packages/shared-types/dist

EXPOSE 3000

CMD ["node", "apps/backend/dist/main"]
