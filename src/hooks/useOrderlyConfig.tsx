import { useMemo } from "react";
import { TradingPageProps } from "@orderly.network/trading";
import {
  BottomNavProps,
  FooterProps,
  MainNavWidgetProps,
} from "@orderly.network/ui-scaffold";
import { type RestrictedInfoOptions } from "@orderly.network/hooks";
import { AppLogos } from "@orderly.network/react-app";
import { OrderlyActiveIcon, OrderlyIcon } from "../components/icons/orderly";
import { useTranslation } from "@orderly.network/i18n";
import { PathEnum } from "../constant";
import {
  LeaderboardInactiveIcon,
  PortfolioInactiveIcon,
  PortfolioActiveIcon,
  LeaderboardActiveIcon,
  MarketsActiveIcon,
  MarketsInactiveIcon,
  TradingInactiveIcon,
  TradingActiveIcon,
} from "@orderly.network/ui";

export type OrderlyConfig = {
  orderlyAppProvider: {
    appIcons: AppLogos;
    restrictedInfo?: RestrictedInfoOptions;
  };
  scaffold: {
    mainNavProps: MainNavWidgetProps;
    footerProps: FooterProps;
    bottomNavProps: BottomNavProps;
  };
  tradingPage: {
    tradingViewConfig: TradingPageProps["tradingViewConfig"];
    sharePnLConfig: TradingPageProps["sharePnLConfig"];
  };
};

export const useOrderlyConfig = () => {
  const { t } = useTranslation();

  return useMemo<OrderlyConfig>(() => {
    return {
      scaffold: {
        mainNavProps: {
          mainMenus: [
            {
              name: t("common.trading"),
              href: PathEnum.Root,
              isHomePageInMobile: true,
            },
            { name: t("common.portfolio"), href: PathEnum.Portfolio },
            { name: t("common.markets"), href: PathEnum.Markets },
            {
              name: t("tradingLeaderboard.leaderboard"),
              href: PathEnum.Leaderboard,
            },
          ],
          initialMenu: PathEnum.Root,
          campaigns: {
            name: t("tradingRewards.rewards"),
            href: PathEnum.Rewards,
            isSubMenuInMobile: true,
            subMenuBackNav: {
              name: t("common.portfolio"),
              href: PathEnum.Portfolio,
            },
            children: [
              {
                name: t("common.tradingRewards"),
                href: PathEnum.RewardsTrading,
                description: t("extend.tradingRewards.description"),
              },
              {
                name: t("common.affiliate"),
                href: PathEnum.RewardsAffiliate,
                tag: t("extend.affiliate.tag"),
                description: t("extend.affiliate.description"),
              },
              {
                name: t("extend.staking"),
                href: "https://app.orderly.network/staking",
                description: t("extend.staking.description"),
                target: "_blank",
                icon: <OrderlyIcon size={14} />,
                activeIcon: <OrderlyActiveIcon size={14} />,
              },
            ],
          },
          trailing: "Next.js with nginx tempalte",
        },
        footerProps: {
          telegramUrl: "https://orderly.network",
          discordUrl: "https://discord.com/invite/orderlynetwork",
          twitterUrl: "https://twitter.com/OrderlyNetwork",
        },
        bottomNavProps: {
          mainMenus: [
            {
              name: t("common.markets"),
              href: PathEnum.Markets,
              activeIcon: <MarketsActiveIcon />,
              inactiveIcon: <MarketsInactiveIcon />,
            },
            {
              name: t("common.trading"),
              href: PathEnum.Root,
              activeIcon: <TradingActiveIcon />,
              inactiveIcon: <TradingInactiveIcon />,
            },
            {
              name: t("tradingLeaderboard.leaderboard"),
              href: PathEnum.Leaderboard,
              activeIcon: <LeaderboardActiveIcon />,
              inactiveIcon: <LeaderboardInactiveIcon />,
            },
            {
              name: t("common.portfolio"),
              href: PathEnum.Portfolio,
              activeIcon: <PortfolioActiveIcon />,
              inactiveIcon: <PortfolioInactiveIcon />,
            },
          ],
        },
      },
      orderlyAppProvider: {
        appIcons: {
          main: {
            component: (
              <img
                alt="Orderly logo"
                src="/images/orderly-logo.svg"
                style={{ width: 100, height: 40 }}
              />
            ),
          },
          secondary: {
            img: "/images/orderly-logo-secondary.svg",
          },
        },
        restrictedInfo: {
          enableDefault: true,
          customRestrictedIps: [],
          customRestrictedRegions: [],
        },
      },
      tradingPage: {
        tradingViewConfig: {
          scriptSRC: "/tradingview/charting_library/charting_library.js",
          library_path: "/tradingview/charting_library/",
          customCssUrl: "/tradingview/chart.css",
        },
        sharePnLConfig: {
          backgroundImages: [
            "/images/pnl/poster_bg_1.png",
            "/images/pnl/poster_bg_2.png",
            "/images/pnl/poster_bg_3.png",
            "/images/pnl/poster_bg_4.png",
          ],

          color: "rgba(255, 255, 255, 0.98)",
          profitColor: "rgba(41, 223, 169, 1)",
          lossColor: "rgba(245, 97, 139, 1)",
          brandColor: "rgba(255, 255, 255, 0.98)",

          // ref
          refLink: "https://orderly.network",
          refSlogan: "Orderly referral",
        },
      },
    };
  }, [t]);
};
