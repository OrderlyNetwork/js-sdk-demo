"use client";
import React, { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import { PortfolioLayoutWidget } from "@orderly.network/portfolio";
import config from "@/config";
import { useNav } from "@/hooks/useNav";

export default function PortfolioLayout(props: { children: ReactNode }) {
  const pathname = usePathname();

  const { onRouteChange } = useNav();

  const currentPath = useMemo(() => {
    if (pathname.endsWith("/portfolio")) return "/portfolio";
    if (pathname.endsWith("/portfolio/fee")) return "/portfolio/feeTier";
    if (pathname.endsWith("/portfolio/api-key")) return "/portfolio/apiKey";
    return pathname;
  }, [pathname]);

  return (
    <PortfolioLayoutWidget
      footerProps={config.scaffold.footerProps}
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: "/portfolio",
      }}
      routerAdapter={{
        onRouteChange,
        currentPath,
      }}
    >
      {props.children}
    </PortfolioLayoutWidget>
  );
}
