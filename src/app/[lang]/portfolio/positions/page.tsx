import React from "react";
import { Metadata } from "next";
import { generatePageTitle } from "@/utils";
import { PageTitleMap, PathEnum } from "@/constant";
import PositionsView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.Positions]),
};

export default function PositionsPage() {
  return <PositionsView />;
}
