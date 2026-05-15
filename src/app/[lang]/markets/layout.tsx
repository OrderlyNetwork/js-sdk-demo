"use client";

import React, { ReactNode } from "react";
import { BaseLayout } from "@/components/baseLayout";
import { PathEnum } from "@/constant";

export default function MarketsLayout(props: { children: ReactNode }) {
  return (
    <BaseLayout initialMenu={PathEnum.Markets}>{props.children}</BaseLayout>
  );
}
