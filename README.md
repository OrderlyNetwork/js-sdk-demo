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

3. Run

```
pnpm dev
```

4. Build

```
pnpm build
```

5. Create docker image

```
docker build -t orderly-js-sdk-vite-template .
```

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
vX.Y.Z.W-demo-BRANCH-N
vX.Y.Z.W-dmm-BRANCH-N
vX.Y.Z.W-demo-dev-N
vX.Y.Z.W-dmm-dev-N
vX.Y.Z.W-demo-qa-N
vX.Y.Z.W-dmm-qa-N
```

## Docs

For more information, please visit the following link:

- [Orderly JS SDK](https://github.com/OrderlyNetwork/js-sdk)
- [SDK documentation](https://orderly.network/docs/sdks)
