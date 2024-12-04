import React from "react";
import { Metadata } from "next";
import { generatePageTitle } from "@/utils";
import OrdersView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle("Orders"),
};

export default function OrdersPage() {
  return <OrdersView />;
}
