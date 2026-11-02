import { useMemo } from "react";
import { useSearchParams } from "react-router";
import type { NetworkId } from "@orderly.network/types";
import { appTargetConfig } from "@/components/orderlyConfig/appTargetConfig";

export type BrokerConfig = {
  brokerId: string;
  brokerName: string;
};

/**
 * Resolve brokerId / brokerName from URL query params.
 * URL overrides are only applied when networkId is testnet.
 */
export function resolveBrokerConfig(
  networkId: NetworkId,
  searchParams: Pick<URLSearchParams, "get">,
  defaults: BrokerConfig = {
    brokerId: appTargetConfig.brokerId,
    brokerName: appTargetConfig.brokerName,
  },
): BrokerConfig {
  const allowOverride = networkId === "testnet";
  const urlBrokerId = searchParams.get("brokerId")?.trim() || undefined;
  const urlBrokerName = searchParams.get("brokerName")?.trim() || undefined;

  return {
    brokerId: allowOverride && urlBrokerId ? urlBrokerId : defaults.brokerId,
    brokerName:
      allowOverride && urlBrokerName ? urlBrokerName : defaults.brokerName,
  };
}

export function useBrokerFromUrl(networkId: NetworkId): BrokerConfig {
  const [searchParams] = useSearchParams();

  return useMemo(
    () => resolveBrokerConfig(networkId, searchParams),
    [searchParams, networkId],
  );
}
