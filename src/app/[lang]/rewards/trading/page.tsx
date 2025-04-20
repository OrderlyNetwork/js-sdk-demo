import React from "react";
import { Metadata } from "next";
import { generatePageTitle } from "@/utils";
import TradingRewardsView from "./view";
import { PageTitleMap, PathEnum } from "@/constant";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.RewardsTrading]),
};

export default function TradingRewardsPage() {
  return <TradingRewardsView />;
}
