"use client";
import React, { ReactNode, useMemo } from "react";
import {
  PortfolioLayoutWidget,
  PortfolioLeftSidebarPath,
} from "@orderly.network/portfolio";
import { useNav } from "@/hooks/useNav";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { usePathWithoutLang } from "@/hooks/usePathWithoutLang";
import { PathEnum } from "@/constant";

export default function PortfolioLayout(props: { children: ReactNode }) {
  const config = useOrderlyConfig();
  const path = usePathWithoutLang();

  const { onRouteChange } = useNav();

  const currentPath = useMemo(() => {
    if (path.endsWith(PathEnum.FeeTier))
      return PortfolioLeftSidebarPath.FeeTier;

    if (path.endsWith(PathEnum.ApiKey)) return PortfolioLeftSidebarPath.ApiKey;

    return path;
  }, [path]);

  return (
    <PortfolioLayoutWidget
      footerProps={config.scaffold.footerProps}
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: PathEnum.Portfolio,
      }}
      routerAdapter={{
        onRouteChange,
      }}
      leftSideProps={{
        current: currentPath,
      }}
    >
      {props.children}
    </PortfolioLayoutWidget>
  );
}
