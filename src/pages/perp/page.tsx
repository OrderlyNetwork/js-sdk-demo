import { useParams } from "react-router";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { DEFAULT_SYMBOL } from "@/storage";
import { generatePageTitle, formatSymbol } from "@/utils";
import PerpView from "./view";

export default function PerpPage() {
  const { symbol } = useParams();
  const currentSymbol = symbol || DEFAULT_SYMBOL;
  useDocumentTitle(generatePageTitle(formatSymbol(currentSymbol)));

  return <PerpView symbol={currentSymbol} />;
}
