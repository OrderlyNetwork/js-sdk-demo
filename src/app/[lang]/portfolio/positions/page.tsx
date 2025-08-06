import React from "react";
import { Metadata } from "next";
import { generatePageTitle } from "@/utils";
import { PageTitleMap, PathEnum } from "@/constant";
import PositionsView from "./view";
import { generateLangParams } from "@/utils/staticParams";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.Positions]),
};

export async function generateStaticParams() {
  return generateLangParams();
}

export default function PositionsPage() {
  return <PositionsView />;
}
