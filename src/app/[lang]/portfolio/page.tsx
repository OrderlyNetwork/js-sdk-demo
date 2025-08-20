import { Metadata } from "next";
import { PageTitleMap, PathEnum } from "@/constant";
import { generatePageTitle } from "@/utils";
import PortfolioView from "./view";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.Portfolio]),
};

export default function PortfolioPage() {
  return <PortfolioView />;
}
