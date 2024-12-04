import React from "react";
import { Metadata } from "next";
import { generatePageTitle } from "@/utils";
import APIKeyView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle("API keys"),
};

export default function APIKeyPage() {
  return <APIKeyView />;
}
