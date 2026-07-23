import { useMemo } from "react";
import type { ConfigKey, URLS } from "@orderly.network/core";
import { ExtendedConfigStore } from "@orderly.network/hooks";
import type { NetworkId } from "@orderly.network/types";
import { type AppEnv, resolveSdkEnv } from "@/config/runtime";

export type ConfigStoreOptions = {
  brokerId: string;
  brokerName: string;
  networkId: NetworkId;
  appEnv?: AppEnv;
  urls?: URLS;
};

export class CustomConfigStore extends ExtendedConfigStore {
  constructor(options: ConfigStoreOptions) {
    const { appEnv, urls, ...init } = options;
    super({
      ...init,
      env: resolveSdkEnv(appEnv),
    } as Partial<Record<ConfigKey, unknown>>);

    if (urls) {
      this.set("apiBaseUrl", urls.apiBaseUrl);
      this.set("publicWsUrl", urls.publicWsUrl);
      this.set("privateWsUrl", urls.privateWsUrl);
      this.set("operatorUrl", urls.operatorUrl);
    }
  }
}

export const createConfigStore = (
  options: ConfigStoreOptions,
): CustomConfigStore => {
  return new CustomConfigStore(options);
};

export const useConfigStore = (
  options: ConfigStoreOptions,
): CustomConfigStore => {
  const { brokerId, brokerName, networkId, appEnv, urls } = options;

  return useMemo(
    () => createConfigStore({ brokerId, brokerName, networkId, appEnv, urls }),
    [brokerId, brokerName, networkId, appEnv, urls],
  );
};
