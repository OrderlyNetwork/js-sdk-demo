import { useParams } from "react-router";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { DEFAULT_SYMBOL } from "@/perpSymbolStorage";
import { generatePageTitle, formatSymbol } from "@/utils";
import PerpView from "./view";

export default function PerpPage() {
  const { symbol } = useParams();
  const currentSymbol = symbol || DEFAULT_SYMBOL;
  useDocumentTitle(generatePageTitle(formatSymbol(currentSymbol)));

  return <PerpView symbol={currentSymbol} />;
}
