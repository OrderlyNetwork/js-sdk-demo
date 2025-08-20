import React from "react";
import { Metadata } from "next";
import { PageTitleMap, PathEnum } from "@/constant";
import { generatePageTitle } from "@/utils";
import LeaderboardView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.Leaderboard]),
};

export default function LeaderboardPage() {
  return <LeaderboardView />;
}
