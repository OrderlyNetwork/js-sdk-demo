"use client";
import { useMemo } from "react";
import { useScaffoldContext } from "@orderly.network/ui-scaffold";
import { Box, useScreen } from "@orderly.network/ui";
import {
  Campaign,
  LeaderboardWidget,
} from "@orderly.network/trading-leaderboard";
import { PathEnum } from "@/constant";
import { i18n, parseI18nLang } from "@orderly.network/i18n";
import { getSymbol } from "@/storage";

const leaderboardCampaigns: Campaign[] = [
  {
    title: "Berachain trading rush: $5,000 USDC reward pool",
    description:
      "To celebrate the powerhouse partnership between Berachain, Orderly, and WOOFi Pro, we’re giving you the chance to win from a $5,000 USDC reward pool just by trading on WOOFi Pro. Whether you’re a first-timer or a longtime user, rewards are up for grabs—don’t miss your shot!",
    image: "/leaderboard/campaign1_bg.jpg",
    startTime: new Date("2025-04-08T09:00:00Z"),
    endTime: new Date("2025-04-14T09:00:00Z"),
    href: "https://www.notion.so/Berachain-trading-rush-5-000-USDC-reward-pool-1b2afa8a243d801fa2bae0b3eb4fff21",
  },
];

export default function LeaderboardView() {
  const { isMobile } = useScreen();
  const { topNavbarHeight, footerHeight, announcementHeight } =
    useScaffoldContext();

  const tradingUrl = useMemo(() => {
    const symbol = getSymbol();
    return `/${parseI18nLang(i18n.language)}${PathEnum.Perp}/${symbol}`;
  }, []);

  return (
    <Box
      style={{
        minHeight: 379,
        maxHeight: 2560,
        overflow: "hidden",
        height: isMobile
          ? "100%"
          : `calc(100vh - ${topNavbarHeight}px - ${footerHeight}px - ${
              announcementHeight ? announcementHeight + 12 : 0
            }px)`,
      }}
    >
      <LeaderboardWidget
        campaigns={leaderboardCampaigns}
        href={{
          trading: tradingUrl,
        }}
        backgroundSrc="/leaderboard/background.jpg"
        className="oui-py-5"
      />
    </Box>
  );
}
