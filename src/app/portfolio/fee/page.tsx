import React from "react";
import { Metadata } from "next";
import { generatePageTitle } from "@/utils";
import FeeTierView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle("Fee tier"),
};

export default function FeeTierPage() {
  return <FeeTierView />;
}
