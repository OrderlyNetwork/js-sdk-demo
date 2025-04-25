import React from "react";
import { Metadata } from "next";
import MarketsView from "./view";
import { generatePageTitle } from "@/utils";
import { PathEnum, PageTitleMap } from "@/constant";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.Markets]),
};

export default function MarketsPage() {
  return <MarketsView />;
}
