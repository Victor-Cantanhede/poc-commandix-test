FROM node:20-alpine AS builder

WORKDIR /app

# Install openssl for Prisma engines
RUN apk add --no-cache openssl

# Enable pnpm
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/
COPY apps/backend/prisma apps/backend/prisma
COPY packages/shared-types/package.json packages/shared-types/

# Install dependencies for the workspace
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/backend apps/backend
COPY packages/shared-types packages/shared-types
COPY tsconfig.base.json .

# Generate Prisma Client manually because schema is nested
RUN pnpm --filter backend run db:generate

# Build backend and dependencies
RUN pnpm -r run build
RUN npx esbuild apps/backend/src/seed.ts --bundle --platform=node --target=node20 --external:@prisma/client --external:bcrypt --outfile=apps/backend/dist/seed.js

# Production image
FROM node:20-alpine

WORKDIR /app

# Install openssl for Prisma engines
RUN apk add --no-cache openssl

RUN corepack enable

COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=builder /app/packages/shared-types/package.json ./packages/shared-types/

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Generate Prisma Client for production
RUN pnpm --filter backend run db:generate

# Copy built code
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/packages/shared-types/dist ./packages/shared-types/dist

EXPOSE 3000

CMD ["node", "apps/backend/dist/src/main.js"]
