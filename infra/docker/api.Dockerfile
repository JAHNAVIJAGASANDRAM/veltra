FROM node:22-alpine AS base
WORKDIR /app

COPY package.json package-lock.json* tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/security/package.json packages/security/package.json

RUN npm install

COPY . .
RUN npm run build --workspace @veltra/api

EXPOSE 5000
CMD ["npm", "run", "start", "--workspace", "@veltra/api"]
