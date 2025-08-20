"use client";

import React, { ReactNode } from "react";
import { BaseLayout } from "@/components/baseLayout";
import { PathEnum } from "@/constant";

export default function LeaderboardLayout(props: { children: ReactNode }) {
  return (
    <BaseLayout initialMenu={PathEnum.Leaderboard}>{props.children}</BaseLayout>
  );
}
