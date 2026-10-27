import { useCallback } from "react";
import { parsePath, useLocation, useNavigate } from "react-router";
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

// Disable preservation when the caller supplies a complete query with removals.
export const useNav = ({ preserveSearchParams = true } = {}) => {
  const navigate = useNavigate();
  const { search: currentSearch } = useLocation();

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

      const params = new URLSearchParams(
        preserveSearchParams && option.scope !== "announcement"
          ? currentSearch
          : "",
      );
      const targetParams = new URLSearchParams(search);
      // Replace all values for target keys while retaining unrelated parameters.
      new Set(targetParams.keys()).forEach((key) => params.delete(key));
      targetParams.forEach((value, key) => params.append(key, value));

      // An explicit "?" prevents generatePath from restoring window.location.search.
      navigate(
        `${generatePath({ path, search: `?${params.toString()}` })}${hash}`,
        {
          replace: option.replace,
        },
      );
    },
    [navigate, currentSearch, preserveSearchParams],
  );

  return { onRouteChange };
};
