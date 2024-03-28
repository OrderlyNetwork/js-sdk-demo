pnpm i @orderly.network/react@internal @orderly.network/web3-onboard@internal
pnpm i @orderly.network/react@demo @orderly.network/web3-onboard@demo
# alpha
pnpm i @orderly.network/react@alpha @orderly.network/web3-onboard@alpha @orderly.network/core@alpha
pnpm dev
# prod
pnpm i @orderly.network/react @orderly.network/web3-onboard @orderly.network/core
pnpm dev
# rc
pnpm i @orderly.network/react@rc @orderly.network/web3-onboard@rc @orderly.network/core@rc
pnpm dev

pnpm i @web3-onboard/trezor @web3-onboard/walletconnect @web3-onboard/ledger @web3-onboard/injected-wallets


pnpm i @orderly.network/react@internal @orderly.network/web3-onboard@internal @orderly.network/core@internal @orderly.network/hooks@internal
pnpm dev

#编译：
docker build -t orderly-web-demo .
#运行：
docker run -p 3000:3000 orderly-web-demo

# 本地调试
cd ../orderly-web
pnpm build

cd ../front-end
pnpm i 
pnpm dev