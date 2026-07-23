FROM node:22-alpine AS base
RUN npm install -g pnpm@10

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

ARG VITE_APP_TARGET=demo
ENV VITE_APP_TARGET=${VITE_APP_TARGET}

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM nginx:stable-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
COPY entrypoint.sh /entrypoint.sh

EXPOSE 3000

CMD ["sh", "/entrypoint.sh"]
