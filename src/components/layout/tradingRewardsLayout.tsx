import { Outlet } from "react-router";
import { TradingRewardsLayoutWidget } from "@orderly.network/trading-rewards";
import { PathEnum } from "@/constant";
import { useNav } from "@/hooks/useNav";
import { useOrderlyConfig } from "@/hooks/useOrderlyConfig";
import { usePathWithoutLang } from "@/hooks/usePathWithoutLang";

export function TradingRewardsLayout() {
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
      <Outlet />
    </TradingRewardsLayoutWidget>
  );
}
