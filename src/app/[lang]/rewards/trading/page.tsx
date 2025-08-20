import React from "react";
import { Metadata } from "next";
import { PageTitleMap, PathEnum } from "@/constant";
import { generatePageTitle } from "@/utils";
import TradingRewardsView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.RewardsTrading]),
};

export default function TradingRewardsPage() {
  return <TradingRewardsView />;
}
