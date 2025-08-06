import React from "react";
import { Metadata } from "next";
import { generatePageTitle } from "@/utils";
import SettingsView from "./view";
import { PathEnum, PageTitleMap } from "@/constant";
import { generateLangParams } from '@/utils/staticParams';

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.Setting]),
};

export async function generateStaticParams() {
  return generateLangParams();
}

export default function SettingsPage() {
  return <SettingsView />;
}
