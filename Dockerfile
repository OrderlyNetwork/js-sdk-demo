# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
FROM node:18-slim AS base
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app

WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc ./
RUN npm install -g pnpm && pnpm install 

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

ENV PORT=3000
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]