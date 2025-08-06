import React from "react";
import { Metadata } from "next";
import { generatePageTitle } from "@/utils";
import FeeTierView from "./view";
import { PathEnum, PageTitleMap } from "@/constant";
import { generateLangParams } from '@/utils/staticParams';

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.FeeTier]),
};

export async function generateStaticParams() {
  return generateLangParams();
}

export default function FeeTierPage() {
  return <FeeTierView />;
}
