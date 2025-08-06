FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app
COPY package*.json pnpm-lock.yaml .npmrc ./
RUN pnpm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/out /usr/share/nginx/html
# COPY --from=builder /app/public /usr/share/nginx/html
# COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
