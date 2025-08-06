import React from "react";
import { Metadata } from "next";
import AffiliateView from "./view";
import { generatePageTitle } from "@/utils";
import { PageTitleMap, PathEnum } from "@/constant";
import { generateLangParams } from '@/utils/staticParams';

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.RewardsAffiliate]),
};

export async function generateStaticParams() {
  return generateLangParams();
}

export default function AffiliatePage() {
  return <AffiliateView />;
}
