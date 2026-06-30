FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .

ENV PATH="/app/node_modules/.bin:${PATH}"

RUN pnpm install --frozen-lockfile \
  && tsc -p packages/contracts/tsconfig.json \
  && tsc -b apps/web/tsconfig.json \
  && pnpm --filter @veltra/web exec vite build

FROM nginx:1.27-alpine
COPY infra/nginx/web.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
