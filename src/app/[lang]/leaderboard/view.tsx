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

function getCampaigns() {
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const dateRange = [
    // ongoing
    { startTime: addDays(new Date(), -1), endTime: addDays(new Date(), 30) },
    // future
    { startTime: addDays(new Date(), 1), endTime: addDays(new Date(), 30) },
    // past
    { startTime: addDays(new Date(), -30), endTime: addDays(new Date(), -1) },
  ];

  return dateRange.map(
    (date) =>
      ({
        title: "RISE ABOVE. OUTTRADE THE REST",
        description:
          "A new era of traders is rising. Are you the one leading the charge? Compete for your share of $10K by climbing the ranks. Only the bold will make it to the top.",
        image: "/leaderboard/campaign.jpg",
        href: "https://orderly.network/",
        ...date,
      } as Campaign)
  );
}

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
        campaigns={getCampaigns()}
        href={{
          trading: tradingUrl,
        }}
        backgroundSrc="/leaderboard/background.jpg"
        className="oui-py-5"
      />
    </Box>
  );
}
