import { Metadata } from "next";
import { generatePageTitle } from "@/utils";
import PortfolioView from "./view";
import { PageTitleMap, PathEnum } from "@/constant";
import { generateLangParams } from "@/utils/staticParams";

export const metadata: Metadata = {
  title: generatePageTitle(PageTitleMap[PathEnum.Portfolio]),
};

export async function generateStaticParams() {
  return generateLangParams();
}

export default function PortfolioPage() {
  return <PortfolioView />;
}
