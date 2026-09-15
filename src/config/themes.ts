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
    // Uses SDK default DARK_THEME_CSS_VARS (ODS v2).
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
