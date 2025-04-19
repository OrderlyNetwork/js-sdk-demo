"use client";
import React, { ReactNode } from "react";
import { BaseLayout } from "@/components/baseLayout";
import { PathEnum } from "@/constant";
import { useScreen } from "@orderly.network/ui";

export default function LeaderboardLayout(props: { children: ReactNode }) {
  const { isDesktop } = useScreen();

  return (
    <BaseLayout
      initialMenu={PathEnum.Leaderboard}
      classNames={{
        root: isDesktop ? "oui-overflow-hidden" : undefined,
      }}
    >
      {props.children}
    </BaseLayout>
  );
}
