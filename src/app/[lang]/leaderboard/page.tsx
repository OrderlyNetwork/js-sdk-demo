import React from "react";
import { Metadata } from "next";
import LeaderboardView from "./view";
import { generatePageTitle } from "@/utils";
import { PageTitleMap, PathEnum } from "@/constant";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.Leaderboard]),
};

export default function LeaderboardPage() {
  return <LeaderboardView />;
}
