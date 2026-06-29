FROM node:22-alpine AS base
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/security/package.json packages/security/package.json

RUN pnpm install --frozen-lockfile

RUN apk add --no-cache wget

COPY . .
RUN pnpm --filter @veltra/config run build \
  && pnpm --filter @veltra/contracts run build \
  && pnpm --filter @veltra/api run build

EXPOSE 5000
CMD ["pnpm", "--filter", "@veltra/api", "run", "start"]
