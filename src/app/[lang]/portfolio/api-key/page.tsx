import React from "react";
import { Metadata } from "next";
import { generatePageTitle } from "@/utils";
import APIKeyView from "./view";
import { PathEnum, PageTitleMap } from "@/constant";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.ApiKey]),
};

export default function APIKeyPage() {
  return <APIKeyView />;
}
