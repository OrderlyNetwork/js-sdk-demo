import React from "react";
import { Metadata } from "next";
import AffiliateView from "./view";
import { generatePageTitle } from "@/utils";
import { PageTitleMap, PathEnum } from "@/constant";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.RewardsAffiliate]),
};

export default function AffiliatePage() {
  return <AffiliateView />;
}
