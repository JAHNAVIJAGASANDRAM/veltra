FROM node:22-alpine AS base
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate \
  && apk add --no-cache wget

COPY . .

ENV PATH="/app/node_modules/.bin:${PATH}"

RUN pnpm install --frozen-lockfile \
  && tsc -p packages/config/tsconfig.json \
  && tsc -p packages/contracts/tsconfig.json \
  && tsc -p packages/security/tsconfig.json \
  && tsc -p apps/api/tsconfig.json

EXPOSE 5000
CMD ["pnpm", "--filter", "@veltra/api", "run", "start"]
