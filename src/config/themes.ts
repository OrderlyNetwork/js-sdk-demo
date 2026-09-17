import {
  CLASSIC_DARK_THEME_CSS_VARS,
  LIGHT_THEME_CSS_VARS,
  type ThemeConfig,
} from "@orderly.network/ui";
import { BLUE_DARK_THEME_CSS_VARS } from "@/theme";

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
    id: "classic-dark",
    displayName: "Dark (Classic)",
    mode: "dark",
    cssVars: CLASSIC_DARK_THEME_CSS_VARS,
  },
  {
    id: "blue-dark",
    displayName: "Dark (Blue)",
    mode: "dark",
    cssVars: BLUE_DARK_THEME_CSS_VARS,
  },
  {
    id: "light",
    displayName: "Light",
    mode: "light",
    cssVars: LIGHT_THEME_CSS_VARS,
  },
];
