import { describe, expect, it } from "vitest";
import {
  CLASSIC_DARK_THEME_CSS_VARS,
  DARK_THEME_CSS_VARS,
} from "@orderly.network/ui";
import { themes } from "./themes";

describe("theme presets", () => {
  it("registers Dark as the default theme using SDK DARK_THEME_CSS_VARS", () => {
    const dark = themes.find((theme) => theme.id === "orderly");

    expect(dark?.displayName).toBe("Dark");
    expect(dark?.isDefault).toBe(true);
    expect(dark?.cssVars).toBeUndefined();
    expect(DARK_THEME_CSS_VARS["--oui-color-primary"]).toBe("156 117 255");
    expect(DARK_THEME_CSS_VARS["--oui-color-primary-darken"]).toBe("103 0 206");
    // Gradient pairs are flat so gradient treatments render solid.
    expect(DARK_THEME_CSS_VARS["--oui-gradient-brand-start"]).toBe(
      DARK_THEME_CSS_VARS["--oui-gradient-brand-end"],
    );
  });

  it("registers Dark (Classic) as the retained previous dark preset", () => {
    const classicDark = themes.find((theme) => theme.id === "classic-dark");

    expect(classicDark?.displayName).toBe("Dark (Classic)");
    expect(classicDark?.cssVars).toBe(CLASSIC_DARK_THEME_CSS_VARS);
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
});
