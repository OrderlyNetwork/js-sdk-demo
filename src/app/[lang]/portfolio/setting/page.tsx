import React from "react";
import { Metadata } from "next";
import { PathEnum, PageTitleMap } from "@/constant";
import { generatePageTitle } from "@/utils";
import SettingsView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.Setting]),
};

export default function SettingsPage() {
  return <SettingsView />;
}
