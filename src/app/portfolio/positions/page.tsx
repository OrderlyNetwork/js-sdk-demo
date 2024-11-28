import React from "react";
import { Metadata } from "next";
import { generatePageTitle } from "@/utils";
import PositionsView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle("Positions"),
};

export default function PositionsPage() {
  return <PositionsView />;
}
