# 1. Prepare Stage
FROM node:20 AS prepare
WORKDIR /app

RUN npm install -g turbo@latest
COPY package.json package-lock.json turbo.json .npmrc ./
COPY packages packages
COPY apps apps

RUN turbo prune @repo/notification-service --docker

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

COPY --from=builder /app/apps/notification-service/dist ./apps/notification-service/dist
COPY --from=builder /app/packages /app/packages

COPY --from=prepare /app/out/full/apps/notification-service/package.json ./apps/notification-service/
COPY --from=prepare /app/out/full/apps/notification-service/tsconfig.json ./apps/notification-service/

ENV NODE_PATH=./node_modules
USER node

CMD ["node", "apps/notification-service/dist/main.js"]