import React from "react";
import { generatePageTitle } from "@/utils";
import { PageTitleMap, PathEnum } from "@/constant";
import { generateLangParams } from '@/utils/staticParams';
import { Metadata } from "next";
import AssetsView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.Assets]),
};

export async function generateStaticParams() {
  return generateLangParams();
}

export default function AssetsPage() {
  return <AssetsView />;
}
