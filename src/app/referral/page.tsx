import { Metadata } from "next";
import { generatePageTitle } from "@/utils";
import AffiliateView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle("Referral"),
};

export default function PortfolioPage() {
  return <AffiliateView />;
}