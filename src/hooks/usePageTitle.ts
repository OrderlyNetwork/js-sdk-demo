import { useEffect } from "react";
import { useParams } from "react-router";
import { usePathWithoutLang } from "./usePathWithoutLang";
import { PageTitleMap, PathEnum } from "../constant";
import { formatSymbol, generatePageTitle } from "../utils";

/** update the page title when the path changes */
export function usePageTitle() {
  const params = useParams();

  const path = usePathWithoutLang();

  useEffect(() => {
    let title = PageTitleMap[path as keyof typeof PageTitleMap];

    const symbol = params.symbol;
    if (path.startsWith(PathEnum.Perp) && symbol) {
      title = formatSymbol(symbol);
    }

    document.title = generatePageTitle(title);
  }, [params, path]);
}
