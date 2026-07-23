/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TARGET?: "demo" | "dmm";
  readonly VITE_APP_ENV?: "dev" | "qa" | "staging" | "prod" | "prod-iap";
  readonly VITE_MAINNET_APP_URL?: string;
  readonly VITE_TESTNET_APP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
