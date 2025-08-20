import React from "react";
import { Metadata } from "next";
import { PageTitleMap, PathEnum } from "@/constant";
import { generatePageTitle } from "@/utils";
import AssetsView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.Assets]),
};

export default function AssetsPage() {
  return <AssetsView />;
}
