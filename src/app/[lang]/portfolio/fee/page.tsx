import React from "react";
import { Metadata } from "next";
import { PathEnum, PageTitleMap } from "@/constant";
import { generatePageTitle } from "@/utils";
import FeeTierView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.FeeTier]),
};

export default function FeeTierPage() {
  return <FeeTierView />;
}
