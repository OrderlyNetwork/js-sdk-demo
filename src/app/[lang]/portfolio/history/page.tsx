import React from "react";
import { Metadata } from "next";
import { PageTitleMap, PathEnum } from "@/constant";
import { generatePageTitle } from "@/utils";
import HistoryView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.History]),
};

export default function HistoryPage() {
  return <HistoryView />;
}
