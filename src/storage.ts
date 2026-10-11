export const DEFAULT_SYMBOL = "PERP_ETH_USDC";
export const ORDERLY_SYMBOL_KEY = "orderly-current-symbol";

// Mirror of @orderly.network/utils BINARY_SYMBOL_PATTERN; swap for the
// isBinarySymbol import once @orderly.network/utils becomes a direct dep.
const BINARY_SYMBOL_PATTERN = /^PERP_([A-Z0-9]+?)(5M|10M|15M)(\d{10})_USDC$/;
const isBinarySymbol = (symbol: string) => BINARY_SYMBOL_PATTERN.test(symbol);

export function getSymbol() {
  const symbol = localStorage.getItem(ORDERLY_SYMBOL_KEY) || DEFAULT_SYMBOL;
  // A prediction round contract stored before the updateSymbol guard is not a
  // perps market; fall back so symbol-less /perp redirects stay valid.
  return isBinarySymbol(symbol) ? DEFAULT_SYMBOL : symbol;
}

export function updateSymbol(symbol: string) {
  // Never persist a prediction round symbol (e.g. PERP_BTC5M2608271200_USDC)
  // as the perps symbol; it would hijack every symbol-less /perp redirect.
  if (isBinarySymbol(symbol)) return;
  localStorage.setItem(ORDERLY_SYMBOL_KEY, symbol || DEFAULT_SYMBOL);
}
