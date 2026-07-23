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

ARG ENABLE_SOURCEMAP=false
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SENTRY_RELEASE

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN ENABLE_SOURCEMAP="${ENABLE_SOURCEMAP}" \
    SENTRY_AUTH_TOKEN="${SENTRY_AUTH_TOKEN}" \
    SENTRY_ORG="${SENTRY_ORG}" \
    SENTRY_PROJECT="${SENTRY_PROJECT}" \
    SENTRY_RELEASE="${SENTRY_RELEASE}" \
    pnpm build
RUN if find /app/dist -type f -name '*.map' -print -quit | grep -q .; then \
      echo "Source maps remain in /app/dist after the Sentry upload step."; \
      find /app/dist -type f -name '*.map' | head -20; \
      exit 1; \
    fi

FROM nginx:stable-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
COPY entrypoint.sh /entrypoint.sh

EXPOSE 3000

CMD ["sh", "/entrypoint.sh"]
