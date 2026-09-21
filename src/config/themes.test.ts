import { describe, expect, it } from "vitest";
import { DARK_THEME_CSS_VARS } from "@orderly.network/ui";
import { SQUARE_DARK_THEME_CSS_VARS, TEAL_DARK_THEME_CSS_VARS } from "@/theme";
import { themes } from "./themes";

describe("theme presets", () => {
  it("registers Dark as the default theme using SDK DARK_THEME_CSS_VARS", () => {
    const dark = themes.find((theme) => theme.id === "orderly");

    expect(dark?.displayName).toBe("Dark");
    expect(dark?.isDefault).toBe(true);
    // Demo overrides only the font; palette still comes from SDK default.
    expect(dark?.cssVars?.["--oui-font-family"]).toContain("Atyp BL Text");
    expect(DARK_THEME_CSS_VARS["--oui-color-primary"]).toBe("156 117 255");
    expect(DARK_THEME_CSS_VARS["--oui-color-primary-darken"]).toBe("103 0 206");
    // Gradient pairs are flat so gradient treatments render solid.
    expect(DARK_THEME_CSS_VARS["--oui-gradient-brand-start"]).toBe(
      DARK_THEME_CSS_VARS["--oui-gradient-brand-end"],
    );
  });

  it("follows the documented theme order", () => {
    expect(themes.map((theme) => theme.id)).toEqual([
      "orderly",
      "light",
      "square-dark",
      "blue-dark",
      "mint-dark",
      "cyan-dark",
      "teal-dark",
    ]);
  });

  it("keeps Dark (Blue) as a distinct consumer preset", () => {
    const dark = themes.find((theme) => theme.id === "orderly");
    const blueDark = themes.find((theme) => theme.id === "blue-dark");

    expect(blueDark?.displayName).toBe("Dark (Blue)");
    expect(blueDark?.cssVars?.["--oui-color-primary"]).toBe("96 140 255");
    expect(blueDark?.cssVars?.["--oui-color-primary-darken"]).toBe("51 95 252");
    expect(blueDark?.cssVars?.["--oui-color-primary-contrast"]).toBe(
      "255 255 255",
    );
    expect(blueDark?.cssVars?.["--oui-gradient-secondary-end"]).toBe("45 0 97");
    expect(blueDark?.cssVars?.["--oui-gradient-brand-start"]).toBe(
      "38 254 255",
    );
    expect(blueDark?.cssVars?.["--oui-gradient-brand-end"]).toBe("89 176 254");
    expect(blueDark?.cssVars).not.toBe(dark?.cssVars);
  });

  it("keeps Dark (Square) as a rounding-only preset", () => {
    const squareDark = themes.find((theme) => theme.id === "square-dark");

    expect(squareDark?.displayName).toBe("Dark (Square)");
    expect(squareDark?.cssVars).toBe(SQUARE_DARK_THEME_CSS_VARS);
    // Only corner radius is overridden; colors inherit the default palette.
    expect(SQUARE_DARK_THEME_CSS_VARS["--oui-rounded"]).toBe("0");
    expect(SQUARE_DARK_THEME_CSS_VARS["--oui-rounded-full"]).toBe("0");
  });

  it("attaches TradingView chart colors to the presets that define them", () => {
    const mint = themes.find((theme) => theme.id === "mint-dark");
    const cyan = themes.find((theme) => theme.id === "cyan-dark");
    const teal = themes.find((theme) => theme.id === "teal-dark");

    expect(mint?.tradingViewColorConfig).toEqual({
      upColor: "#0FB276",
      downColor: "#F5464B",
      pnlUpColor: "#0FB276",
      pnlDownColor: "#F5464B",
    });
    // Raydium and What render SDK default chart colors.
    expect(cyan?.tradingViewColorConfig).toBeUndefined();
    expect(teal?.tradingViewColorConfig).toBeUndefined();
  });

  it("extracts brand palettes from the source sites", () => {
    const mint = themes.find((theme) => theme.id === "mint-dark");
    const cyan = themes.find((theme) => theme.id === "cyan-dark");
    const teal = themes.find((theme) => theme.id === "teal-dark");

    expect(mint?.cssVars?.["--oui-color-primary"]).toBe("0 228 171");
    expect(cyan?.cssVars?.["--oui-color-primary"]).toBe("34 209 248");
    expect(teal?.cssVars).toBe(TEAL_DARK_THEME_CSS_VARS);
    expect(teal?.cssVars?.["--oui-color-primary"]).toBe("2 166 194");
    // What (teal-dark) removes every corner radius, like Dark (Square).
    expect(teal?.cssVars?.["--oui-rounded-full"]).toBe("0");
  });
});
