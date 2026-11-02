import { useMemo } from "react";
import { useSearchParams } from "react-router";
import type { OrderlyAppProviderProps } from "@orderly.network/react-app";
import type { NetworkId } from "@orderly.network/types";
import { appTargetConfig } from "@/components/orderlyConfig/appTargetConfig";

/** Both demo targets include official announcements unless testnet explicitly excludes them. */
export function resolveAnnouncementConfig(
  networkId: NetworkId,
  searchParams: Pick<URLSearchParams, "get">,
): { excludeOfficial: boolean } {
  return {
    excludeOfficial:
      networkId === "testnet" &&
      searchParams.get("excludeOfficial")?.trim() === "true",
  };
}

/** Preserve target widget settings while applying the reactive URL announcement override. */
export function useAnnouncementFromUrl(
  networkId: NetworkId,
  defaults = appTargetConfig.widgetConfigs,
): NonNullable<OrderlyAppProviderProps["widgetConfigs"]> {
  const [searchParams] = useSearchParams();

  return useMemo(
    () => ({
      ...defaults,
      announcement: {
        ...defaults?.announcement,
        ...resolveAnnouncementConfig(networkId, searchParams),
      },
    }),
    [defaults, networkId, searchParams],
  );
}
