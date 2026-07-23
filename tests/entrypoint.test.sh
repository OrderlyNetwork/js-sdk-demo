#!/bin/sh

set -eu

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
validator=$(sed -n '/^is_valid_app_url() {/,/^}/p' "${project_dir}/entrypoint.sh")
eval "${validator}"

assert_valid() {
  if ! is_valid_app_url "$1"; then
    echo "Expected valid URL: $1" >&2
    exit 1
  fi
}

assert_invalid() {
  if is_valid_app_url "$1"; then
    echo "Expected invalid URL: $1" >&2
    exit 1
  fi
}

assert_valid "http://localhost"
assert_valid "https://example.com"
assert_valid "https://example.com:8443/app?network=mainnet#trade"
assert_valid "https://sub-domain.example.com/"
assert_valid "https://[2001:db8::1]:443/app"
assert_valid "https://user:password@example.com"

assert_invalid ""
assert_invalid "example.com"
assert_invalid "ftp://example.com"
assert_invalid "https://"
assert_invalid "https:///app"
assert_invalid "https://?network=mainnet"
assert_invalid "https://#trade"
assert_invalid "https://example.com\\evil"
assert_invalid "https://example.com/has space"

echo "entrypoint URL validation tests passed"
