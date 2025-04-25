import React from "react";
import { Metadata } from "next";
import { generatePageTitle } from "@/utils";
import OrdersView from "./view";
import { PathEnum, PageTitleMap } from "@/constant";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.Orders]),
};

export default function OrdersPage() {
  return <OrdersView />;
}
