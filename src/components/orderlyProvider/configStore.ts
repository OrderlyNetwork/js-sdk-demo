import { useEffect, useMemo, useState } from "react";
import { CustomConfigStore } from "./customConfigStore";

export type ConfigStoreOptions = {
  networkId?: string;
  brokerId?: string;
  brokerName?: string;
  env?: string;
};

const BROKER_ID = "zijun_b";
const BROKER_NAME = "Orderly";

const DOMAINS: Record<"prod" | "staging" | "qa" | "dev", string[]> = {
  dev: ["dev-dmm.orderly.network", "localhost"],
  qa: ["qa-dmm.orderly.network"],
  staging: ["staging-dmm.orderly.network"],
  prod: ["dmm.orderly.network"],
};

export const useConfigStore = (params: ConfigStoreOptions) => {
  const { networkId, brokerId, brokerName } = params;

  const env = useEnv();

  const configStore = useMemo(() => {
    return new CustomConfigStore({
      env: env || "prod",
      networkId: networkId || "testnet",
      brokerId: brokerId || BROKER_ID,
      brokerName: brokerName || BROKER_NAME,
    });
  }, [networkId, brokerId, brokerName, env]);

  return configStore;
};

function useEnv() {
  const [env, setEnv] = useState<"prod" | "staging" | "qa" | "dev">("prod");

  useEffect(() => {
    const hostname = window.location.hostname;
    if (DOMAINS.dev.includes(hostname)) {
      setEnv("dev");
    } else if (DOMAINS.qa.includes(hostname)) {
      setEnv("qa");
    } else if (DOMAINS.staging.includes(hostname)) {
      setEnv("staging");
    } else {
      setEnv("prod");
    }
  }, []);
  return env;
}
