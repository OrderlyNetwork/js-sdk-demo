/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TARGET?: "demo" | "dmm";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
