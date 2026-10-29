import type { OrderlyAppProviderProps } from "@orderly.network/react-app";
import { widgetConfigs } from "./widgetConfigs";

/** Build target selected via `VITE_APP_TARGET`. */
export type AppTarget = "demo" | "dmm";

type AppTargetConfig = {
  title: string;
  description: string;
  brokerId: string;
  brokerName: string;
  widgetConfigs?: OrderlyAppProviderProps["widgetConfigs"];
};

const getAppTarget = (): AppTarget => {
  return import.meta.env.VITE_APP_TARGET === "dmm" ? "dmm" : "demo";
};

/**
 * Per-target app identity (title, broker, widget overrides).
 * - demo: SDK demo site (`brokerId: demo`), e.g. demo.orderly.network
 * - dmm: Dynamic Market Maker site (`brokerId: orderly`), e.g. dmm.orderly.network
 */
export const appTargetConfigMap: Record<AppTarget, AppTargetConfig> = {
  demo: {
    title: "Orderly SDK Demo",
    description: "Orderly SDK Demo",
    brokerId: "demo",
    brokerName: "Orderly Demo",
  },
  /** DMM = Dynamic Market Maker（动态做市商） */
  dmm: {
    title: "Orderly SDK DMM",
    description: "Orderly SDK DMM",
    brokerId: "orderly",
    brokerName: "Orderly DMM",
    widgetConfigs,
  },
};

export const appTarget = getAppTarget();
export const appTargetConfig = appTargetConfigMap[appTarget];
