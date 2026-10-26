import { useCallback } from "react";
import { parsePath, useNavigate } from "react-router";
import { generatePath } from "@orderly.network/i18n";
import { PortfolioLeftSidebarPath } from "@orderly.network/portfolio";
import { perpRoute, type RouteOption } from "@orderly.network/types";
import { PathEnum } from "@/constant";
import { getPerpSymbol } from "@/perpSymbolStorage";

// if href not equal to the route path, we need to convert it to the route path
const routeMap: Partial<Record<PortfolioLeftSidebarPath, PathEnum>> = {
  [PortfolioLeftSidebarPath.FeeTier]: PathEnum.FeeTier,
  [PortfolioLeftSidebarPath.ApiKey]: PathEnum.ApiKey,
};

const openExternalUrl = (href: string) => {
  try {
    const url = new URL(href, window.location.origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return;
    }

    const openedWindow = window.open(
      url.toString(),
      "_blank",
      "noopener,noreferrer",
    );
    if (openedWindow) {
      openedWindow.opener = null;
    }
  } catch {
    // Ignore malformed external URLs.
  }
};

export const useNav = () => {
  const navigate = useNavigate();

  const onRouteChange = useCallback(
    (option: RouteOption) => {
      if (option.target === "_blank") {
        openExternalUrl(option.href);
        return;
      }

      const { pathname = "/", search, hash = "" } = parsePath(option.href);
      const path =
        pathname === "/"
          ? perpRoute(getPerpSymbol()).href
          : routeMap[pathname] || pathname;

      navigate(`${generatePath({ path, search })}${hash}`, {
        replace: option.replace,
      });
    },
    [navigate],
  );

  return { onRouteChange };
};
