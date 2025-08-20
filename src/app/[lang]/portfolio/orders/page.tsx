import React from "react";
import { Metadata } from "next";
import { PathEnum, PageTitleMap } from "@/constant";
import { generatePageTitle } from "@/utils";
import OrdersView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.Orders]),
};

export default function OrdersPage() {
  return <OrdersView />;
}
