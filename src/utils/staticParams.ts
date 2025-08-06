export const SUPPORTED_LANGUAGES = [
  "en",
  "zh",
  "ja",
  "es",
  "ko",
  "vi",
  "de",
  "fr",
  "ru",
  "id",
  "tr",
  "it",
  "pt",
  "uk",
  "pl",
  "nl",
] as const;

// Generate static params for language routes
export function generateLangParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export function generateSymbolParams() {
  return SUPPORTED_LANGUAGES.flatMap((lang) => [
    { lang, symbol: "PERP_ETH_USDC" },
    { lang, symbol: "PERP_BTC_USDC" },
    { lang, symbol: "PERP_SOL_USDC" },
  ]);
}
