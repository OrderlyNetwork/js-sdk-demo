import { useMemo } from "react";
import { Outlet } from "react-router";
import { useTranslation } from "@orderly.network/i18n";
import {
  PortfolioLayoutWidget,
  PortfolioLeftSidebarPath,
} from "@orderly.network/portfolio";
import { PathEnum } from "@/constant";
import { useNav } from "@/hooks/useNav";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { usePathWithoutLang } from "@/hooks/usePathWithoutLang";

export function PortfolioLayout() {
  const { t } = useTranslation();
  const config = useOrderlyConfig();
  const path = usePathWithoutLang();
  const { onRouteChange } = useNav();

  const currentPath = useMemo(() => {
    if (path.endsWith(PathEnum.FeeTier)) {
      return PortfolioLeftSidebarPath.FeeTier;
    }

    if (path.endsWith(PathEnum.ApiKey)) {
      return PortfolioLeftSidebarPath.ApiKey;
    }

    return path;
  }, [path]);

  return (
    <PortfolioLayoutWidget
      key={currentPath}
      footerProps={config.scaffold.footerProps}
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: PathEnum.Portfolio,
      }}
      routerAdapter={{
        onRouteChange,
        currentPath,
      }}
      leftSideProps={{
        current: currentPath,
        className: "portfolio-left-sidebar",
        title: (
          <span className="oui-text-primary">{t("common.portfolio")}</span>
        ),
      }}
      bottomNavProps={config.scaffold.bottomNavProps}
    >
      <Outlet />
    </PortfolioLayoutWidget>
  );
}
