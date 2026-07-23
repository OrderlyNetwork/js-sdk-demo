#!/bin/sh

set -eu

if [ -z "${APP_ENV:-}" ]; then
  echo "APP_ENV is required (dev, qa, staging, prod, or prod-iap)" >&2
  exit 1
fi

case "${APP_ENV}" in
  dev|qa|staging|prod|prod-iap) ;;
  *)
    echo "Invalid APP_ENV: ${APP_ENV}. Expected dev, qa, staging, prod, or prod-iap" >&2
    exit 1
    ;;
esac

is_valid_app_url() {
  value=$1

  printf '%s' "${value}" | grep -Eq '^https?://[^/?#[:space:]"\\]+([/?#][^[:space:]"\\]*)?$'
}

validate_app_url() {
  name=$1
  value=$2

  if [ -z "${value}" ]; then
    echo "${name} is required" >&2
    exit 1
  fi

  if ! is_valid_app_url "${value}"; then
    echo "${name} must be an absolute http or https URL with a non-empty authority" >&2
    exit 1
  fi
}

validate_app_url "MAINNET_APP_URL" "${MAINNET_APP_URL:-}"
validate_app_url "TESTNET_APP_URL" "${TESTNET_APP_URL:-}"

escape_json_string() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

escaped_mainnet_app_url=$(escape_json_string "${MAINNET_APP_URL}")
escaped_testnet_app_url=$(escape_json_string "${TESTNET_APP_URL}")

printf '%s\n' \
  'window.__RUNTIME_CONFIG__ = Object.freeze({' \
  "  APP_ENV: \"${APP_ENV}\"," \
  "  MAINNET_APP_URL: \"${escaped_mainnet_app_url}\"," \
  "  TESTNET_APP_URL: \"${escaped_testnet_app_url}\"," \
  '});' \
  > /usr/share/nginx/html/runtime-env.js

exec nginx -g "daemon off;"
