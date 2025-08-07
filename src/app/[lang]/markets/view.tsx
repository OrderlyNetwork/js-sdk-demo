"use client";
import React from "react";
import { MarketsHomePage } from "@orderly.network/markets";
import { useSymbolChange } from "@/hooks/useSymbolChange";

export default function MarketsView() {
  const onSymbolChange = useSymbolChange();
  return <MarketsHomePage onSymbolChange={onSymbolChange} />;
}
