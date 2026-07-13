import type { OrderlyAppProviderProps } from "@orderly.network/react-app";
import { widgetConfigs } from "./widgetConfigs";

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

export const appTargetConfigMap: Record<AppTarget, AppTargetConfig> = {
  demo: {
    title: "Orderly SDK Demo",
    description: "Orderly SDK Demo",
    brokerId: "demo",
    brokerName: "Orderly",
  },
  dmm: {
    title: "Orderly SDK DMM",
    description: "Orderly SDK DMM",
    brokerId: "orderly",
    brokerName: "Orderly",
    widgetConfigs,
  },
};

export const appTarget = getAppTarget();
export const appTargetConfig = appTargetConfigMap[appTarget];
