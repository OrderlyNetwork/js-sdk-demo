FROM node:18 AS base

FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc ./
RUN npm install -g pnpm@8.6.5 && pnpm install 
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm install -g pnpm@8.6.5 && pnpm build

# production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/dist/standalone ./
COPY --from=builder /app/dist/static ./dist/static
COPY --from=builder /app/public ./public

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]