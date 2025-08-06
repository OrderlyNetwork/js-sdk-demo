import React from "react";
import { Metadata } from "next";
import { generatePageTitle } from "@/utils";
import OrdersView from "./view";
import { PathEnum, PageTitleMap } from "@/constant";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.Orders]),
};

// Generate static params for all supported languages
export async function generateStaticParams() {
  return [
    { lang: "en" },
    { lang: "zh" },
    { lang: "ja" },
    { lang: "es" },
    { lang: "ko" },
    { lang: "vi" },
    { lang: "de" },
    { lang: "fr" },
  ];
}

export default function OrdersPage() {
  return <OrdersView />;
}
