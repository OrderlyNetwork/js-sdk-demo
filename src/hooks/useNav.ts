import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { RouteOption } from "@orderly.network/ui-scaffold";
import { getSymbol } from "@/storage";
import { PathEnum } from "@/constant";
import { PortfolioLeftSidebarPath } from "@orderly.network/portfolio";
import { i18n, parseI18nLang } from "@orderly.network/i18n";

export function useNav() {
  const router = useRouter();

  const onRouteChange = useCallback(
    (option: RouteOption) => {
      if (option.target === "_blank") {
        window.open(option.href);
        return;
      }
      const lang = parseI18nLang(i18n.language);

      if (option.href === "/") {
        const symbol = getSymbol();
        router.push(`/${lang}/${PathEnum.Perp}/${symbol}`);
        return;
      }

      // if href not equal to the route path, we need to convert it to the route path
      const routeMap = {
        [PortfolioLeftSidebarPath.FeeTier]: PathEnum.FeeTier,
        [PortfolioLeftSidebarPath.ApiKey]: PathEnum.ApiKey,
      } as Record<string, string>;

      const path = routeMap[option.href] || option.href;

      router.push(`/${lang}${path}`);
    },
    [router]
  );

  const campaigns = useMemo(() => {
    return {
        name: i18n.t('tradingRewards.rewards'),
        href: PathEnum.Rewards,
        // icon: `${process.env.PUBLIC_URL}/images/reward.gif`,
        testid: 'oui-testid-main-nav-rewards',
        isSubMenuInMobile: true,
        subMenuBackNav: {
            name: i18n.t('common.portfolio'),
            href: PathEnum.Portfolio,
        },
        children: [
            {
                name: i18n.t('common.tradingRewards'),
                href: PathEnum.RewardsTrading,
                description: i18n.t('extend.tradingRewards.description'),
                testid: 'oui-testid-main-nav-rewards-item-tradingRewards',
            },
            {
                name: i18n.t('common.affiliate'),
                href: PathEnum.RewardsAffiliate,
                tag: i18n.t('extend.affiliate.tag'),
                description: i18n.t('extend.affiliate.description'),
                testid: 'oui-testid-main-nav-rewards-item-affiliate',
            },
        ],
    };
}, []);

  return { onRouteChange, campaigns };
}
