import { API_URLS, type URLS } from "@orderly.network/core";
import type { NetworkId } from "@orderly.network/types";

export const APP_ENVS = ["dev", "qa", "staging", "prod", "prod-iap"] as const;

export type AppEnv = (typeof APP_ENVS)[number];
export type SdkEnv = Exclude<AppEnv, "prod-iap">;

export type RuntimeConfig = {
  APP_ENV: AppEnv;
  MAINNET_APP_URL: string;
  TESTNET_APP_URL: string;
  API_BASE_URL?: string;
  PUBLIC_WS_URL?: string;
  PRIVATE_WS_URL?: string;
  OPERATOR_EVM_URL?: string;
  OPERATOR_SOLANA_URL?: string;
};

export type ViteRuntimeEnv = {
  VITE_APP_ENV?: string;
  VITE_MAINNET_APP_URL?: string;
  VITE_TESTNET_APP_URL?: string;
};

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig;
  }
}

const MAINNET_APP_ENVS: ReadonlySet<AppEnv> = new Set(["prod", "prod-iap"]);
const APP_ENV_SET: ReadonlySet<string> = new Set(APP_ENVS);
const MAINNET_OVERRIDE_KEY = "ENABLE_MAINNET";

const LOCAL_ENV_URLS: Record<AppEnv, URLS> = {
  dev: {
    apiBaseUrl: "https://api.dev.orderly-i.network",
    publicWsUrl: "wss://ws.dev.orderly-i.network",
    privateWsUrl: "wss://ws-private.dev.orderly-i.network",
    operatorUrl: {
      EVM: "https://operator.dev.orderly-i.network",
      SOL: "https://sol-operator.dev.orderly-i.network",
    },
  },
  qa: {
    apiBaseUrl: "https://api.qa.orderly-i.network",
    publicWsUrl: "wss://ws.qa.orderly-i.network",
    privateWsUrl: "wss://ws-private.qa.orderly-i.network",
    operatorUrl: {
      EVM: "https://operator.qa.orderly-i.network",
      SOL: "https://sol-operator.qa.orderly-i.network",
    },
  },
  staging: API_URLS.testnet,
  prod: API_URLS.mainnet,
  "prod-iap": API_URLS.mainnet,
};

const isAppEnv = (value: string | undefined): value is AppEnv => {
  return value !== undefined && APP_ENV_SET.has(value);
};

const optionalValue = (value: string | undefined): string | undefined => {
  return value?.trim() || undefined;
};

export const resolveRuntimeConfig = (
  isViteDev: boolean,
  viteEnv: ViteRuntimeEnv,
  containerConfig: RuntimeConfig | undefined,
): RuntimeConfig | undefined => {
  if (!isViteDev) {
    return containerConfig;
  }

  if (!isAppEnv(viteEnv.VITE_APP_ENV)) {
    return undefined;
  }

  const urls = LOCAL_ENV_URLS[viteEnv.VITE_APP_ENV];

  return {
    APP_ENV: viteEnv.VITE_APP_ENV,
    MAINNET_APP_URL: viteEnv.VITE_MAINNET_APP_URL?.trim() || "",
    TESTNET_APP_URL: viteEnv.VITE_TESTNET_APP_URL?.trim() || "",
    API_BASE_URL: urls.apiBaseUrl,
    PUBLIC_WS_URL: urls.publicWsUrl,
    PRIVATE_WS_URL: urls.privateWsUrl,
    OPERATOR_EVM_URL: urls.operatorUrl.EVM,
    OPERATOR_SOLANA_URL: urls.operatorUrl.SOL,
  };
};

export const getRuntimeConfig = (): RuntimeConfig | undefined => {
  return resolveRuntimeConfig(
    import.meta.env.DEV,
    import.meta.env,
    typeof window === "undefined" ? undefined : window.__RUNTIME_CONFIG__,
  );
};

export const resolveNetworkId = (
  appEnv: AppEnv | undefined,
  mainnetOverrideEnabled: boolean,
): NetworkId => {
  if (mainnetOverrideEnabled) {
    return "mainnet";
  }

  return !appEnv || MAINNET_APP_ENVS.has(appEnv) ? "mainnet" : "testnet";
};

export const getAppEnvNetworkId = (): NetworkId => {
  return resolveNetworkId(getRuntimeConfig()?.APP_ENV, false);
};

export const isMainnetOverrideEnabled = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(window.localStorage.getItem(MAINNET_OVERRIDE_KEY));
};

export const getNetworkId = (): NetworkId => {
  return resolveNetworkId(
    getRuntimeConfig()?.APP_ENV,
    isMainnetOverrideEnabled(),
  );
};

export const resolveSdkEnv = (appEnv: AppEnv | undefined): SdkEnv => {
  if (appEnv === "prod-iap") {
    return "prod";
  }

  return appEnv ?? "prod";
};

type OrderlyUrlOverrides = Partial<Omit<URLS, "operatorUrl">> & {
  operatorUrl?: Partial<URLS["operatorUrl"]>;
};

const getOrderlyUrlOverrides = (
  config: RuntimeConfig | undefined,
): OrderlyUrlOverrides => {
  if (!config) {
    return {};
  }

  const operatorUrl = {
    EVM: optionalValue(config.OPERATOR_EVM_URL),
    SOL: optionalValue(config.OPERATOR_SOLANA_URL),
  };

  return {
    apiBaseUrl: optionalValue(config.API_BASE_URL),
    publicWsUrl: optionalValue(config.PUBLIC_WS_URL),
    privateWsUrl: optionalValue(config.PRIVATE_WS_URL),
    operatorUrl: operatorUrl.EVM || operatorUrl.SOL ? operatorUrl : undefined,
  };
};

export type ResolvedOrderlyConfig = {
  appEnv: AppEnv | undefined;
  networkId: NetworkId;
  sdkEnv: SdkEnv;
  urls: URLS;
};

export const resolveOrderlyConfig = (
  config: RuntimeConfig | undefined,
  mainnetOverrideEnabled: boolean,
): ResolvedOrderlyConfig => {
  const appEnv = config?.APP_ENV;
  const appEnvNetworkId = resolveNetworkId(appEnv, false);
  const networkId = resolveNetworkId(appEnv, mainnetOverrideEnabled);
  const defaults = API_URLS[appEnvNetworkId];
  const overrides = getOrderlyUrlOverrides(config);
  const operatorOverrides = overrides.operatorUrl ?? {};

  return {
    appEnv,
    networkId,
    sdkEnv: resolveSdkEnv(appEnv),
    urls: {
      apiBaseUrl: overrides.apiBaseUrl ?? defaults.apiBaseUrl,
      publicWsUrl: overrides.publicWsUrl ?? defaults.publicWsUrl,
      privateWsUrl: overrides.privateWsUrl ?? defaults.privateWsUrl,
      operatorUrl: {
        EVM: operatorOverrides.EVM ?? defaults.operatorUrl.EVM,
        SOL: operatorOverrides.SOL ?? defaults.operatorUrl.SOL,
      },
    },
  };
};

export const getOrderlyConfig = (): ResolvedOrderlyConfig => {
  return resolveOrderlyConfig(getRuntimeConfig(), isMainnetOverrideEnabled());
};

const getNetworkAppUrl = (networkId: NetworkId): string | undefined => {
  const config = getRuntimeConfig();
  const appUrl =
    networkId === "mainnet" ? config?.MAINNET_APP_URL : config?.TESTNET_APP_URL;

  return appUrl?.trim() || undefined;
};

type AppLocation = Pick<Location, "pathname" | "search" | "hash">;

const normalizeBasePath = (pathname: string): string => {
  return pathname.replace(/\/+$/, "");
};

const stripBasePath = (pathname: string, basePath: string): string => {
  if (!basePath) {
    return pathname;
  }

  if (pathname === basePath) {
    return "/";
  }

  return pathname.startsWith(`${basePath}/`)
    ? pathname.slice(basePath.length)
    : pathname;
};

export const buildNetworkAppUrl = (
  targetAppUrl: string,
  currentAppUrl: string | undefined,
  location: AppLocation,
): URL => {
  const destination = new URL(targetAppUrl);
  const targetBasePath = normalizeBasePath(destination.pathname);
  const currentBasePath = currentAppUrl
    ? normalizeBasePath(new URL(currentAppUrl).pathname)
    : "";
  const relativePath = stripBasePath(location.pathname, currentBasePath);

  destination.pathname =
    relativePath === "/"
      ? `${targetBasePath}/`
      : `${targetBasePath}${relativePath}`;
  destination.search = location.search;
  destination.hash = location.hash;

  return destination;
};

type NetworkSwitchInput = {
  networkId: NetworkId;
  appEnvNetworkId: NetworkId;
  mainnetOverrideEnabled: boolean;
  targetAppUrl: string | undefined;
  currentAppUrl: string | undefined;
  currentHref: string;
  location: AppLocation;
};

export type NetworkSwitchDecision =
  | { type: "reload"; clearMainnetOverride: boolean }
  | { type: "redirect"; clearMainnetOverride: boolean; href: string }
  | { type: "missing-url"; clearMainnetOverride: boolean };

export const resolveNetworkSwitch = (
  input: NetworkSwitchInput,
): NetworkSwitchDecision => {
  const clearMainnetOverride =
    input.networkId === "testnet" && input.mainnetOverrideEnabled;

  if (clearMainnetOverride && input.appEnvNetworkId === "testnet") {
    return { type: "reload", clearMainnetOverride };
  }

  if (!input.targetAppUrl) {
    return { type: "missing-url", clearMainnetOverride };
  }

  const destination = buildNetworkAppUrl(
    input.targetAppUrl,
    input.currentAppUrl,
    input.location,
  );

  if (destination.href === input.currentHref) {
    return { type: "reload", clearMainnetOverride };
  }

  return {
    type: "redirect",
    clearMainnetOverride,
    href: destination.href,
  };
};

export const switchAppNetwork = (networkId: NetworkId): void => {
  if (typeof window === "undefined") {
    return;
  }

  const appEnvNetworkId = getAppEnvNetworkId();
  const mainnetOverrideEnabled = isMainnetOverrideEnabled();
  const decision = resolveNetworkSwitch({
    networkId,
    appEnvNetworkId,
    mainnetOverrideEnabled,
    targetAppUrl: getNetworkAppUrl(networkId),
    currentAppUrl: getNetworkAppUrl(appEnvNetworkId),
    currentHref: window.location.href,
    location: window.location,
  });

  if (decision.clearMainnetOverride) {
    window.localStorage.removeItem(MAINNET_OVERRIDE_KEY);
  }

  if (decision.type === "missing-url") {
    console.warn(`Missing ${networkId} application URL in runtime config`);
    return;
  }

  if (decision.type === "reload") {
    window.location.reload();
    return;
  }

  window.location.assign(decision.href);
};
