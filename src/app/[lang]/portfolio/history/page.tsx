import React from "react";
import { generatePageTitle } from "@/utils";
import { PageTitleMap, PathEnum } from "@/constant";
import { Metadata } from "next";
import HistoryView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.History]),
};

export default function HistoryPage() {
  return <HistoryView />;
}
