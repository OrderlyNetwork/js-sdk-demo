import React from "react";
import { Metadata } from "next";
import { PathEnum, PageTitleMap } from "@/constant";
import { generatePageTitle } from "@/utils";
import APIKeyView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.ApiKey]),
};

export default function APIKeyPage() {
  return <APIKeyView />;
}
