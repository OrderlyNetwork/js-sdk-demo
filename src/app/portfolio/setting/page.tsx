import React from "react";
import { Metadata } from "next";
import { generatePageTitle } from "@/utils";
import SettingsView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle("Settings"),
};

export default function SettingsPage() {
  return <SettingsView />;
}
