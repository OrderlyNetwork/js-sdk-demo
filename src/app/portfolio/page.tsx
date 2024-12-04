import { Metadata } from "next";
import { generatePageTitle } from "@/utils";
import PortfolioView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle("Portfolio"),
};

export default function PortfolioPage() {
  return <PortfolioView />;
}
