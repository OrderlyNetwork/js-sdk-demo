import { lightThemeCssVars, ThemeConfig } from "@orderly.network/ui";

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
    cssVars: lightThemeCssVars,
  },
];
