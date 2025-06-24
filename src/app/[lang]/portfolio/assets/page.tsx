import React from "react";
import { generatePageTitle } from "@/utils";
import { PageTitleMap, PathEnum } from "@/constant";
import { Metadata } from "next";
import AssetsView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.Assets]),
};

export default function AssetsPage() {
  return <AssetsView />;
}
