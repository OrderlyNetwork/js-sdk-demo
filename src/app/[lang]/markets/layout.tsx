"use client";

import React, { ReactNode } from "react";
import { useScreen } from "@orderly.network/ui";
import { BaseLayout } from "@/components/baseLayout";
import { PathEnum } from "@/constant";

export default function MarketsLayout(props: { children: ReactNode }) {
  const { isMobile } = useScreen();

  return (
    <BaseLayout
      initialMenu={PathEnum.Markets}
      topBar={isMobile ? <></> : undefined}
    >
      {props.children}
    </BaseLayout>
  );
}
