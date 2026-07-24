# Template for Orderly SDK v2 based on Vite

## Getting started

1. Clone the code:

```
git clone https://github.com/OrderlyNetwork/orderly-js-sdk-vite-template.git
cd orderly-js-sdk-vite-template
```

2. Install the dependencies

```
pnpm install
```

3. Run the staging environment by default

```
pnpm dev
```

Local development supports the same environment split as WOOFi Pro:

| Command               | Vite mode  | Port | Orderly network | SDK env |
| --------------------- | ---------- | ---: | --------------- | ------- |
| `pnpm start:dev`      | `dev`      | 4564 | testnet         | dev     |
| `pnpm start:qa`       | `qa`       | 4565 | testnet         | qa      |
| `pnpm start:staging`  | `staging`  | 4567 | testnet         | staging |
| `pnpm start:prod`     | `prod`     | 4568 | mainnet         | prod    |
| `pnpm start:prod-iap` | `prod-iap` | 4569 | mainnet         | prod    |

`pnpm dev` is an alias for `pnpm start:staging`. `dev` and `qa` use their
matching Orderly internal API, WebSocket, and Operator endpoints. `staging`,
`prod`, and `prod-iap` use the SDK testnet or mainnet endpoints.

Vite loads the committed `env/.env.[mode]` file for each command.
Machine-specific public URL overrides can be placed in an ignored
`env/.env.[mode].local` file:

```dotenv
VITE_MAINNET_APP_URL=https://mainnet.example.com/app/
VITE_TESTNET_APP_URL=https://testnet.example.com/app/
```

Orderly API, WebSocket, and Operator addresses are selected automatically from
`VITE_APP_ENV`. The fixed dev and qa addresses live in the runtime mapping;
staging and production reuse the SDK `API_URLS` defaults.

Only public addresses belong in `VITE_*` variables. To start the DMM target in
any local environment, keep using `VITE_APP_TARGET`, for example:

```
VITE_APP_TARGET=dmm pnpm start:qa
```

4. Build

```
pnpm build
```

Run the automated tests:

```
pnpm test
```

5. Create docker image

```
docker build --build-arg VITE_APP_TARGET=demo -t orderly-js-sdk-vite-template .
```

6. Run the container with runtime environment configuration

```
docker run --rm -p 3000:3000 \
  -e APP_ENV=dev \
  -e MAINNET_APP_URL=https://mainnet.example.com \
  -e TESTNET_APP_URL=https://testnet.example.com \
  orderly-js-sdk-vite-template
```

## Runtime environment

The same image can run in every deployment environment. The container startup
script generates `runtime-env.js` from these required variables:

- `APP_ENV`: `dev`, `qa`, `staging`, `prod`, or `prod-iap`
- `MAINNET_APP_URL`: absolute URL used when switching to mainnet
- `TESTNET_APP_URL`: absolute URL used when switching to testnet

`prod` and `prod-iap` use Orderly mainnet. `dev`, `qa`, and `staging` use
Orderly testnet. Missing or invalid runtime configuration prevents the
container from starting.

The sdk-demo and DMM deployment environments and required K8s environment
variables are:

| Service | Environment | Current URL | `APP_ENV` | `MAINNET_APP_URL` | `TESTNET_APP_URL` |
| ------- | ----------- | ----------- | --------- | ----------------- | ----------------- |
| sdk-demo | dev | https://demo.dev.orderly-i.network/ | `dev` | https://demo.orderly.network/ | https://demo.dev.orderly-i.network/ |
| sdk-demo | qa | https://demo.qa.orderly-i.network/ | `qa` | https://demo.orderly.network/ | https://demo.qa.orderly-i.network/ |
| sdk-demo | staging-iap | https://testnet-iap-demo.orderly.network/ | `staging` | https://demo-iap.orderly.network/ | https://testnet-iap-demo.orderly.network/ |
| sdk-demo | staging | https://testnet-demo.orderly.network/ | `staging` | https://demo.orderly.network/ | https://testnet-demo.orderly.network/ |
| sdk-demo | prod-iap | https://demo-iap.orderly.network/ | `prod` | https://demo-iap.orderly.network/ | https://testnet-iap-demo.orderly.network/ |
| sdk-demo | prod | https://demo.orderly.network/ | `prod` | https://demo.orderly.network/ | https://testnet-demo.orderly.network/ |
| dmm | dev | https://dmm.dev.orderly-i.network/ | `dev` | https://dmm.orderly.network/ | https://dmm.dev.orderly-i.network/ |
| dmm | qa | https://dmm.qa.orderly-i.network/ | `qa` | https://dmm.orderly.network/ | https://dmm.qa.orderly-i.network/ |
| dmm | staging | https://testnet-dmm.orderly.network/ | `staging` | https://dmm.orderly.network/ | https://testnet-dmm.orderly.network/ |
| dmm | prod | https://dmm.orderly.network/ | `prod` | https://dmm.orderly.network/ | https://testnet-dmm.orderly.network/ |

Outside the validated container startup path, a missing `APP_ENV` falls back
to the SDK `prod` environment and Orderly mainnet endpoints.

Local Vite development reads `VITE_APP_ENV` from the selected mode file before
`public/runtime-env.js`, then selects the matching Orderly endpoints.
Production builds ignore the Vite environment selection and continue to read
the container-generated `window.__RUNTIME_CONFIG__`. The existing K8s and
entrypoint contract is unchanged.

For browser-only debugging, a non-empty `ENABLE_MAINNET` local storage value
forces `networkId` to `mainnet`. It does not change `APP_ENV`, the SDK
environment, or the API, WebSocket, and Operator endpoints selected by
`APP_ENV`:

```js
localStorage.setItem("ENABLE_MAINNET", "1");
localStorage.removeItem("ENABLE_MAINNET");
```

## Sentry monitoring

The browser application reports errors and performance traces to Sentry in
every runtime environment. The active environment comes from `APP_ENV`, and a
connected wallet address is used as the Sentry user ID. Default PII collection
is disabled.

Source maps are build-only data and use the following variables:

| Variable            | Purpose                                                  | Required                                |
| ------------------- | -------------------------------------------------------- | --------------------------------------- |
| `ENABLE_SOURCEMAP`  | Generate, upload, and then delete hidden source maps     | No; CI resolves it from the release tag |
| `SENTRY_AUTH_TOKEN` | Sentry token used by the Vite upload plugin              | For source map upload                   |
| `SENTRY_ORG`        | Sentry organization slug                                 | For source map upload                   |
| `SENTRY_PROJECT`    | Sentry project slug                                      | For source map upload                   |
| `SENTRY_RELEASE`    | Release name shared by the bundle and uploaded artifacts | For source map upload; CI uses the tag  |

GitLab must provide `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT` as
protected CI variables. Source maps are enabled only for stable target tags in
the exact form `vX.Y.Z.W-demo` or `vX.Y.Z.W-dmm`. Tags with numeric, branch,
dev, or qa suffixes skip source map generation and upload. The Vite plugin
uploads maps during the Docker builder stage and removes them before the Nginx
image is created.

## Release

Release commands must specify the app target explicitly:

```
VITE_APP_TARGET=demo pnpm release
VITE_APP_TARGET=dmm pnpm release
```

The release tag format must include the target suffix:

```
vX.Y.Z.W-demo
vX.Y.Z.W-dmm
vX.Y.Z.W-demo-N
vX.Y.Z.W-dmm-N
vX.Y.Z.W-demo-BRANCH-N
vX.Y.Z.W-dmm-BRANCH-N
vX.Y.Z.W-demo-dev-N
vX.Y.Z.W-dmm-dev-N
vX.Y.Z.W-demo-qa-N
vX.Y.Z.W-dmm-qa-N
vX.Y.Z.W-demo-BRANCH-dev-N
vX.Y.Z.W-dmm-BRANCH-dev-N
vX.Y.Z.W-demo-BRANCH-qa-N
vX.Y.Z.W-dmm-BRANCH-qa-N
```

Tags ending in `dev-N` or `qa-N` trigger deployment to that environment, so
`dev` and `qa` are reserved environment segments. Base tags, numeric suffix
tags, and other branch suffix tags only build and publish the selected target
without triggering an automatic deployment.

## Docs

For more information, please visit the following link:

- [Orderly JS SDK](https://github.com/OrderlyNetwork/js-sdk)
- [SDK documentation](https://orderly.network/docs/sdks)
