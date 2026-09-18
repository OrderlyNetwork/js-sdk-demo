import { LIGHT_THEME_CSS_VARS, type ThemeConfig } from "@orderly.network/ui";
import {
  BLUE_DARK_THEME_CSS_VARS,
  CYAN_DARK_THEME_CSS_VARS,
  MINT_DARK_THEME_CSS_VARS,
  SQUARE_DARK_THEME_CSS_VARS,
  TEAL_DARK_THEME_CSS_VARS,
} from "@/theme";

export const themes: ThemeConfig[] = [
  {
    id: "orderly",
    displayName: "Dark",
    mode: "dark",
    isDefault: true,
    // SDK default ODS v2 palette; demo loads Atyp BL and overrides the font.
    cssVars: {
      "--oui-font-family":
        '"Atyp BL Text", "PingFang SC", "Noto Sans CJK SC", "Noto Sans", sans-serif',
    },
  },
  {
    id: "light",
    displayName: "Light",
    mode: "light",
    cssVars: LIGHT_THEME_CSS_VARS,
  },
  {
    id: "square-dark",
    displayName: "Dark (Square)",
    mode: "dark",
    cssVars: SQUARE_DARK_THEME_CSS_VARS,
  },
  {
    id: "blue-dark",
    displayName: "Dark (Blue)",
    mode: "dark",
    cssVars: BLUE_DARK_THEME_CSS_VARS,
  },
  {
    id: "mint-dark",
    displayName: "Dark (Mint)",
    mode: "dark",
    cssVars: MINT_DARK_THEME_CSS_VARS,
    tradingViewColorConfig: {
      upColor: "#0FB276",
      downColor: "#F5464B",
      pnlUpColor: "#0FB276",
      pnlDownColor: "#F5464B",
    },
  },
  {
    id: "cyan-dark",
    displayName: "Dark (Cyan)",
    mode: "dark",
    cssVars: CYAN_DARK_THEME_CSS_VARS,
  },
  {
    id: "teal-dark",
    displayName: "Dark (Teal)",
    mode: "dark",
    cssVars: TEAL_DARK_THEME_CSS_VARS,
  },
];
