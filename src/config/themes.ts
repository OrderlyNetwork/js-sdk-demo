import { LIGHT_THEME_CSS_VARS, ThemeConfig } from "@orderly.network/ui";
import { CUSTOM_DARK_THEME_CSS_VARS } from "@/theme";

export const themes: ThemeConfig[] = [
  {
    id: "orderly",
    displayName: "Dark",
    mode: "dark",
  },
  {
    id: "light",
    displayName: "Light",
    mode: "light",
    cssVars: LIGHT_THEME_CSS_VARS,
  },
  {
    id: "custom-dark",
    displayName: "Dark (Custom)",
    mode: "dark",
    cssVars: CUSTOM_DARK_THEME_CSS_VARS,
  },
];
