import { useMemo } from "react";
import { type RestrictedInfoOptions } from "@orderly.network/hooks";
import { useTranslation } from "@orderly.network/i18n";
import { PortfolioLeftSidebarPath } from "@orderly.network/portfolio";
import { AppLogos } from "@orderly.network/react-app";
import { TradingPageProps } from "@orderly.network/trading";
import {
  LeaderboardInactiveIcon,
  PortfolioInactiveIcon,
  PortfolioActiveIcon,
  LeaderboardActiveIcon,
  MarketsActiveIcon,
  MarketsInactiveIcon,
  TradingInactiveIcon,
  TradingActiveIcon,
  TradingIcon,
  BarChartIcon,
  PersonIcon,
  AssetIcon,
  SettingFillIcon,
  EarnIcon,
  AffiliateIcon,
  LeftNavVaultsIcon,
} from "@orderly.network/ui";
import {
  BottomNavProps,
  FooterProps,
  LeftNavProps,
  MainNavWidgetProps,
} from "@orderly.network/ui-scaffold";
import { OrderlySecondaryLogo } from "@/components/icons/orderlySecondaryLogo";
import { OrderlyTextIcon } from "@/components/icons/orderlyText";
import { useCustomRender } from "@/components/layout/useCustomRender";
import { PathEnum } from "../constant";

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

const APP_ICONS: AppLogos = {
  main: {
    component: (
      <OrderlyTextIcon className="oui-w-[100px] oui-h-10 oui-fill-base-contrast" />
    ),
  },
  secondary: {
    component: <OrderlySecondaryLogo className="oui-text-base-contrast" />,
  },
};

const RESTRICTED_INFO: RestrictedInfoOptions = {
  enableDefault: true,
  customRestrictedIps: [],
  customRestrictedRegions: [],
};

const FOOTER_PROPS: FooterProps = {
  telegramUrl: "https://orderly.network",
  discordUrl: "https://discord.com/invite/orderlynetwork",
  twitterUrl: "https://twitter.com/OrderlyNetwork",
};

const TRADING_VIEW_CONFIG: TradingPageProps["tradingViewConfig"] = {
  scriptSRC: "/tradingview/charting_library/charting_library.js",
  library_path: "/tradingview/charting_library/",
  customCssUrl: "/tradingview/chart.css",
};

const SHARE_PNL_CONFIG: TradingPageProps["sharePnLConfig"] = {
  backgroundImages: [
    "/pnl/poster_bg_1.png",
    "/pnl/poster_bg_2.png",
    "/pnl/poster_bg_3.png",
    "/pnl/poster_bg_4.png",
  ],
  color: "rgba(255, 255, 255, 0.98)",
  profitColor: "rgba(41, 223, 169, 1)",
  lossColor: "rgba(245, 97, 139, 1)",
  brandColor: "rgba(255, 255, 255, 0.98)",
  refLink: "https://orderly.network",
  refSlogan: "Orderly referral",
};

export const useOrderlyConfig = () => {
  const { t } = useTranslation();
  const customRender = useCustomRender();

  return useMemo<OrderlyConfig>(() => {
    return {
      scaffold: {
        mainNavProps: {
          customRender,
          mainMenus: [
            {
              name: t("common.trading"),
              href: PathEnum.Root,
              isHomePageInMobile: true,
            },
            { name: t("common.vaults"), href: PathEnum.Vaults },
            { name: t("common.markets"), href: PathEnum.Markets },
            { name: t("common.portfolio"), href: PathEnum.Portfolio },
            {
              name: t("affiliate.referral"),
              href: PathEnum.RewardsAffiliate,
              onlyInMainAccount: true,
              isSubMenuInMobile: true,
              subMenuBackNav: {
                name: t("common.portfolio"),
                href: PathEnum.Portfolio,
              },
            },
            {
              name: t("tradingLeaderboard.leaderboard"),
              href: PathEnum.Leaderboard,
            },
            {
              name: t("tradingView.timeInterval.more"),
              href: "",
              disabled: true,
              className: "oui-cursor-pointer",
              children: [
                {
                  name: t("portfolio.feeTier"),
                  href: PortfolioLeftSidebarPath.FeeTier,
                },
                {
                  name: t("portfolio.apiKeys"),
                  href: PortfolioLeftSidebarPath.ApiKey,
                },
                {
                  name: t("portfolio.setting"),
                  href: PortfolioLeftSidebarPath.Setting,
                },
              ],
            },
          ],
          initialMenu: PathEnum.Root,
          leftNav: getLeftNavMenus(t),
        },
        footerProps: FOOTER_PROPS,
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
        appIcons: APP_ICONS,
        restrictedInfo: RESTRICTED_INFO,
      },
      tradingPage: {
        tradingViewConfig: TRADING_VIEW_CONFIG,
        sharePnLConfig: SHARE_PNL_CONFIG,
      },
    };
  }, [t, customRender]);
};

function getLeftNavMenus(
  t: ReturnType<typeof useTranslation>["t"],
): LeftNavProps {
  return {
    menus: [
      {
        name: t("common.trading"),
        href: PathEnum.Root,
        icon: <TradingIcon />,
      },
      {
        name: t("common.vaults"),
        href: PathEnum.Vaults,
        icon: <LeftNavVaultsIcon />,
      },
      {
        name: t("common.portfolio"),
        href: PathEnum.Portfolio,
        icon: <PersonIcon />,
      },
      {
        name: t("common.markets"),
        href: PathEnum.Markets,
        icon: <BarChartIcon />,
      },
      {
        name: t("tradingLeaderboard.leaderboard"),
        href: PathEnum.Leaderboard,
        icon: <LeaderboardInactiveIcon />,
      },
      {
        name: t("common.assets"),
        href: PathEnum.Assets,
        icon: <AssetIcon />,
      },
      {
        name: t("affiliate.referral"),
        href: PathEnum.RewardsAffiliate,
        icon: <AffiliateIcon />,
        onlyInMainAccount: true,
      },
      {
        name: t("portfolio.setting"),
        href: PathEnum.Setting,
        icon: <SettingFillIcon color="white" opacity={0.8} />,
      },
      {
        name: t("extend.staking"),
        href: "https://app.orderly.network/staking",
        icon: <EarnIcon />,
        target: "_blank",
      },
      {
        name: t("portfolio.feeTier"),
        href: PathEnum.FeeTier,
        isSecondary: true,
      },
      {
        name: t("portfolio.apiKeys"),
        href: PathEnum.ApiKey,
        isSecondary: true,
      },
    ],
    telegramUrl: "https://orderly.network",
    discordUrl: "https://discord.com/invite/orderlynetwork",
    twitterUrl: "https://twitter.com/OrderlyNetwork",
  };
}
