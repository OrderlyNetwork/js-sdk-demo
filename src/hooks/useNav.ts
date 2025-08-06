import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { RouteOption } from "@orderly.network/ui-scaffold";
import { getSymbol } from "@/storage";
import { PathEnum } from "@/constant";
import { PortfolioLeftSidebarPath } from "@orderly.network/portfolio";
import { i18n, parseI18nLang } from "@orderly.network/i18n";

// if href not equal to the route path, we need to convert it to the route path
const routeMap: Partial<Record<PortfolioLeftSidebarPath, PathEnum>> = {
  [PortfolioLeftSidebarPath.FeeTier]: PathEnum.FeeTier,
  [PortfolioLeftSidebarPath.ApiKey]: PathEnum.ApiKey,
};

export const useNav = () => {
  const router = useRouter();

  const onRouteChange = useCallback(
    (option: RouteOption) => {
      if (option.target === "_blank") {
        window.open(option.href);
        return;
      }
      const lang = parseI18nLang(i18n.language);

      if (option.href === "/") {
        const symbol = getSymbol();
        // const path = `/${lang}/${PathEnum.Perp}/${symbol}`;
        // router.push(path);
        router.push(PathEnum.Root);

        return;
      }

      const path = routeMap[option.href] || option.href;

      router.push(`/${lang}${path}`);
    },
    [router]
  );

  return { onRouteChange };
};
