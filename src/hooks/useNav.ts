import { useCallback } from "react";
import { useNavigate } from "react-router";
import { i18n, parseI18nLang } from "@orderly.network/i18n";
import { PortfolioLeftSidebarPath } from "@orderly.network/portfolio";
import { RouteOption } from "@orderly.network/types";
import { PathEnum } from "@/constant";
import { getSymbol } from "@/storage";

// if href not equal to the route path, we need to convert it to the route path
const routeMap: Partial<Record<PortfolioLeftSidebarPath, PathEnum>> = {
  [PortfolioLeftSidebarPath.FeeTier]: PathEnum.FeeTier,
  [PortfolioLeftSidebarPath.ApiKey]: PathEnum.ApiKey,
};

export const useNav = () => {
  const navigate = useNavigate();

  const onRouteChange = useCallback(
    (option: RouteOption) => {
      if (option.target === "_blank") {
        window.open(option.href);
        return;
      }
      const lang = parseI18nLang(i18n.language);

      if (option.href === "/") {
        const symbol = getSymbol();
        navigate(`/${lang}${PathEnum.Perp}/${symbol}`);
        return;
      }

      const path = routeMap[option.href] || option.href;

      navigate(`/${lang}${path}`);
    },
    [navigate],
  );

  return { onRouteChange };
};
