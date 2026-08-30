import { describe, expect, it } from "vitest";
import { themes } from "./themes";

describe("theme presets", () => {
  it("keeps Dark and the restored Dark (Custom) as distinct presets", () => {
    const dark = themes.find((theme) => theme.id === "orderly");
    const customDark = themes.find((theme) => theme.id === "custom-dark");

    expect(dark?.displayName).toBe("Dark");
    expect(dark?.cssVars?.["--oui-color-primary"]).toBe("156 117 255");
    expect(dark?.cssVars?.["--oui-color-primary-darken"]).toBe("103 0 206");

    expect(customDark?.displayName).toBe("Dark (Custom)");
    expect(customDark?.cssVars?.["--oui-color-primary"]).toBe("96 140 255");
    expect(customDark?.cssVars?.["--oui-color-primary-darken"]).toBe(
      "0 169 222",
    );
    expect(customDark?.cssVars?.["--oui-color-primary-contrast"]).toBe("0 0 0");
    expect(customDark?.cssVars?.["--oui-gradient-brand-start"]).toBe(
      "38 254 255",
    );
    expect(customDark?.cssVars?.["--oui-gradient-brand-end"]).toBe(
      "89 176 254",
    );
    expect(customDark?.cssVars).not.toBe(dark?.cssVars);
  });
});
