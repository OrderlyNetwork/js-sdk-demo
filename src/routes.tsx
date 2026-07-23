import { ComponentType, lazy, useState } from "react";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
  RouteObject,
} from "react-router";
import {
  getLocalePathFromPathname,
  i18n,
  parseI18nLang,
} from "@orderly.network/i18n";
import { BaseLayout } from "@/components/baseLayout";
import { PortfolioLayout, TradingRewardsLayout } from "@/components/layout";
import OrderlyProvider from "@/components/orderlyProvider";
import { LazyPage } from "@/components/pageLoading/LazyPage";
import { PathEnum } from "@/constant";
import { DEFAULT_SYMBOL, getSymbol } from "@/storage";
import { tryReloadForChunkError } from "@/utils/chunkLoadRecovery";

const lazyImportPage = (
  importFn: () => Promise<{ default: ComponentType<Record<string, unknown>> }>,
): ComponentType<Record<string, unknown>> => {
  const LazyComponent = lazy(() =>
    importFn().catch((error: unknown) => {
      if (tryReloadForChunkError(error)) {
        return new Promise<{
          default: ComponentType<Record<string, unknown>>;
        }>(() => {});
      }

      throw error;
    }),
  );
  const WrappedComponent = (props: Record<string, unknown>) => (
    <LazyPage>
      <LazyComponent {...props} />
    </LazyPage>
  );
  return WrappedComponent;
};

const LeaderboardPage = lazyImportPage(
  () => import("@/pages/leaderboard/page"),
);
const AnnouncementPage = lazyImportPage(
  () => import("@/pages/announcement/page"),
);
const MarketsPage = lazyImportPage(() => import("@/pages/markets/page"));
const PerpPage = lazyImportPage(() => import("@/pages/perp/page"));
const VaultsPage = lazyImportPage(() => import("@/pages/vaults/page"));
const APIKeyPage = lazyImportPage(
  () => import("@/pages/portfolio/api-key/page"),
);
const AssetsPage = lazyImportPage(
  () => import("@/pages/portfolio/assets/page"),
);
const FeeTierPage = lazyImportPage(() => import("@/pages/portfolio/fee/page"));
const HistoryPage = lazyImportPage(
  () => import("@/pages/portfolio/history/page"),
);
const OrdersPage = lazyImportPage(
  () => import("@/pages/portfolio/orders/page"),
);
const PortfolioPage = lazyImportPage(() => import("@/pages/portfolio/page"));
const PositionsPage = lazyImportPage(
  () => import("@/pages/portfolio/positions/page"),
);
const SettingsPage = lazyImportPage(
  () => import("@/pages/portfolio/setting/page"),
);
const AffiliatePage = lazyImportPage(
  () => import("@/pages/rewards/affiliate/page"),
);
const TradingRewardsPage = lazyImportPage(
  () => import("@/pages/rewards/trading/page"),
);
const HealthPage = lazyImportPage(() => import("@/pages/health/page"));

function LayoutRoute(props: { initialMenu: PathEnum; children: JSX.Element }) {
  return (
    <BaseLayout initialMenu={props.initialMenu}>{props.children}</BaseLayout>
  );
}

const AppRoute = () => {
  let currentLocale = parseI18nLang(i18n?.language);

  const pathname = window.location.pathname;
  const search = window.location.search;
  const hash = window.location.hash;
  const localePath = getLocalePathFromPathname(pathname);
  const [, setReplaceKey] = useState(0);

  if (!localePath && pathname !== PathEnum.Root && pathname !== "/health") {
    const redirectPath = `/${currentLocale}${pathname}${search}${hash}`;
    window.history.replaceState({}, "", redirectPath);
    queueMicrotask(() => setReplaceKey((key) => key + 1));
    return null;
  }

  if (localePath && localePath !== currentLocale) {
    currentLocale = localePath;
    i18n.changeLanguage(localePath);
  } else if (currentLocale !== i18n?.language) {
    i18n.changeLanguage(currentLocale);
  }

  const baseRoutes: RouteObject[] = [
    {
      path: "perp",
      children: [
        {
          index: true,
          element: (
            <Navigate
              to={`${getSymbol() || DEFAULT_SYMBOL}${window.location.search}`}
            />
          ),
        },
        {
          path: ":symbol",
          element: <PerpPage />,
        },
      ],
    },
    {
      path: "portfolio",
      element: <PortfolioLayout />,
      children: [
        {
          index: true,
          element: <PortfolioPage />,
        },
        {
          path: "positions",
          element: <PositionsPage />,
        },
        {
          path: "orders",
          element: <OrdersPage />,
        },
        {
          path: "assets",
          element: <AssetsPage />,
        },
        {
          path: "fee",
          element: <FeeTierPage />,
        },
        {
          path: "api-key",
          element: <APIKeyPage />,
        },
        {
          path: "setting",
          element: <SettingsPage />,
        },
        {
          path: "history",
          element: <HistoryPage />,
        },
      ],
    },
    {
      path: "markets",
      element: (
        <LayoutRoute initialMenu={PathEnum.Markets}>
          <MarketsPage />
        </LayoutRoute>
      ),
    },
    {
      path: "vaults",
      element: (
        <LayoutRoute initialMenu={PathEnum.Vaults}>
          <VaultsPage />
        </LayoutRoute>
      ),
    },
    {
      path: "leaderboard",
      element: (
        <LayoutRoute initialMenu={PathEnum.Leaderboard}>
          <LeaderboardPage />
        </LayoutRoute>
      ),
    },
    {
      path: "announcement",
      element: <AnnouncementPage />,
    },
    {
      path: "rewards",
      element: <TradingRewardsLayout />,
      children: [
        {
          index: true,
          element: <Navigate to={`affiliate${window.location.search}`} />,
        },
        {
          path: "trading",
          element: <TradingRewardsPage />,
        },
        {
          path: "affiliate",
          element: <AffiliatePage />,
        },
      ],
    },
  ];

  const router = createBrowserRouter([
    {
      path: "/health",
      element: <HealthPage />,
    },
    {
      path: "/",
      element: <OrderlyProvider />,
      children: [
        {
          index: true,
          element: (
            <Navigate
              to={`/${currentLocale}${PathEnum.Perp}/${
                getSymbol() || DEFAULT_SYMBOL
              }${window.location.search}`}
            />
          ),
        },
        {
          path: ":lang",
          children: [
            {
              index: true,
              element: <Navigate to={`perp/${DEFAULT_SYMBOL}`} />,
            },
            ...baseRoutes,
          ],
        },
      ],
    },
  ]);

  return (
    <LazyPage>
      <RouterProvider router={router} />
    </LazyPage>
  );
};

export default AppRoute;
