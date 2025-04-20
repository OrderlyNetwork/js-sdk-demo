import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { RouteOption } from "@orderly.network/ui-scaffold";
import { getSymbol } from "@/storage";
import { PathEnum } from "@/constant";
import { PortfolioLeftSidebarPath } from "@orderly.network/portfolio";
import { i18n } from "@orderly.network/i18n";

export function useNav() {
  const router = useRouter();

  const onRouteChange = useCallback(
    (option: RouteOption) => {
      if (option.target === "_blank") {
        window.open(option.href);
        return;
      }

      if (option.href === "/") {
        const symbol = getSymbol();
        router.push(`/${i18n.language}/${PathEnum.Perp}/${symbol}`);
        return;
      }

      // if href not equal to the route path, we need to convert it to the route path
      const routeMap = {
        [PortfolioLeftSidebarPath.FeeTier]: PathEnum.FeeTier,
        [PortfolioLeftSidebarPath.ApiKey]: PathEnum.ApiKey,
      } as Record<string, string>;

      const path = routeMap[option.href] || option.href;

      router.push(`/${i18n.language}${path}`);
    },
    [router]
  );

  return { onRouteChange };
}
