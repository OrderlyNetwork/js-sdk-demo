"use client";
import { ReactNode } from "react";
import { TradingRewardsLayoutWidget } from "@orderly.network/trading-rewards";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { useNav } from "@/hooks/useNav";
import { PathEnum } from "@/constant";
import { usePathWithoutLang } from "@/hooks/usePathWithoutLang";

export default function TradingRewardsLayout(props: { children: ReactNode }) {
  const config = useOrderlyConfig();
  const path = usePathWithoutLang();

  const { onRouteChange } = useNav();

  return (
    <TradingRewardsLayoutWidget
      footerProps={config.scaffold.footerProps}
      mainNavProps={{
        ...config.scaffold.mainNavProps,
        initialMenu: [PathEnum.Rewards, path],
      }}
      routerAdapter={{
        onRouteChange,
      }}
      leftSideProps={{
        current: path,
      }}
      bottomNavProps={config.scaffold.bottomNavProps}
    >
      {props.children}
    </TradingRewardsLayoutWidget>
  );
}
