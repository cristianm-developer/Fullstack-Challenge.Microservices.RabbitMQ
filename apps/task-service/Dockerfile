# 1. Prepare Stage
FROM node:20 AS prepare
WORKDIR /app

RUN npm install -g turbo@latest
COPY package.json package-lock.json turbo.json .npmrc ./
COPY packages packages
COPY apps apps

RUN turbo prune @repo/task-service --docker

# 2. Build Stage
FROM node:20 AS builder
WORKDIR /app

COPY --from=prepare /app/out/json/ .
RUN npm install


COPY --from=prepare /app/out/full/ .
ENV NODE_PATH=./node_modules

RUN npm run build

# 3. Production Stage

FROM node:20-slim AS production
WORKDIR /app
COPY --from=prepare /app/out/json/ ./
COPY --from=prepare /app/out/package-lock.json ./

RUN npm install --omit=dev

COPY --from=builder /app/apps/task-service/dist ./apps/task-service/dist
COPY --from=builder /app/packages /app/packages

COPY --from=prepare /app/out/full/apps/task-service/package.json ./apps/task-service/
COPY --from=prepare /app/out/full/apps/task-service/src/data-source.ts ./apps/task-service/src/
COPY --from=prepare /app/out/full/apps/task-service/src/migrations ./apps/task-service/src/migrations/
COPY --from=prepare /app/out/full/apps/task-service/tsconfig.json ./apps/task-service/

ENV NODE_PATH=./node_modules
USER node

ENTRYPOINT ["sh", "-c", "echo 'Running migrations...' && npm run migration:run --workspace=@repo/task-service && echo 'Migrations ran successfully' && echo 'Starting the application...' && exec node apps/task-service/dist/main.js"]