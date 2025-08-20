import React from "react";
import { Metadata } from "next";
import { PageTitleMap, PathEnum } from "@/constant";
import { generatePageTitle } from "@/utils";
import AffiliateView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.RewardsAffiliate]),
};

export default function AffiliatePage() {
  return <AffiliateView />;
}
