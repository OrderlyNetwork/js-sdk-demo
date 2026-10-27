import { useCallback } from "react";
import { useNavigate } from "react-router";
import { generatePath, getLocalePathFromPathname } from "@orderly.network/i18n";
import { PortfolioLeftSidebarPath } from "@orderly.network/portfolio";
import { perpRoute, type RouteOption } from "@orderly.network/types";
import { PathEnum } from "@/constant";
import { migratePredictionPath } from "@/navigationPaths";
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

      const path = migratePredictionPath(option.href);
      const mapped = routeMap[path] || path;
      const [pathnameAndSearch, ...hashParts] = mapped.split("#");
      const queryIndex = pathnameAndSearch.indexOf("?");
      const pathname =
        queryIndex < 0
          ? pathnameAndSearch
          : pathnameAndSearch.slice(0, queryIndex);
      const targetPath =
        pathname === "/" ? perpRoute(getPerpSymbol()).href : pathname;
      const locale =
        typeof window !== "undefined"
          ? (getLocalePathFromPathname(window.location.pathname) ?? undefined)
          : undefined;
      const href =
        queryIndex < 0
          ? generatePath({ path: targetPath, locale })
          : generatePath({
              path: targetPath,
              locale,
              search: pathnameAndSearch.slice(queryIndex),
            });
      const hash = hashParts.length
        ? `#${hashParts.join("#")}`
        : typeof window !== "undefined"
          ? window.location.hash
          : "";
      navigate(`${href}${hash}`, { replace: option.replace });
    },
    [navigate],
  );

  return { onRouteChange };
};
