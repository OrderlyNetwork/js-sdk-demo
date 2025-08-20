import React from "react";
import { Metadata } from "next";
import { PathEnum, PageTitleMap } from "@/constant";
import { generatePageTitle } from "@/utils";
import MarketsView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.Markets]),
};

export default function MarketsPage() {
  return <MarketsView />;
}
