import React from "react";
import { Metadata } from "next";
import { generatePageTitle } from "@/utils";
import TradingRewardsView from "./view";
import { PageTitleMap, PathEnum } from "@/constant";
import { generateLangParams } from '@/utils/staticParams';

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.RewardsTrading]),
};

export async function generateStaticParams() {
  return generateLangParams();
}

export default function TradingRewardsPage() {
  return <TradingRewardsView />;
}
