import { LIGHT_THEME_CSS_VARS, ThemeConfig } from "@orderly.network/ui";

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
];
