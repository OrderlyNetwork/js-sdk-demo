import { describe, expect, it } from "vitest";
import { localizeEntryPath, migratePredictionPath } from "./navigationPaths";

describe("SDK route compatibility", () => {
  it.each([
    ["/prediction", "/predict"],
    ["/prediction?network=test#orders", "/predict?network=test#orders"],
    ["/prediction#orders", "/predict#orders"],
    [
      "/prediction/PERP_BTC5M2608271200_USDC",
      "/predict/PERP_BTC5M2608271200_USDC",
    ],
    [
      "/zh/prediction/BTC%2F5M%25?x=1#orders",
      "/zh/predict/BTC%2F5M%25?x=1#orders",
    ],
    ["/tc/prediction", "/tc/predict"],
    ["/predictionish/BTC", "/predictionish/BTC"],
    ["/portfolio/prediction", "/portfolio/prediction"],
    ["/predict/BTC", "/predict/BTC"],
  ])("migrates only legacy route segments: %s", (path, expected) => {
    expect(migratePredictionPath(path)).toBe(expected);
  });

  it.each([
    ["/prediction", "/predict"],
    ["/predict", "/predict"],
    ["/prediction/BTC%2F5M%25", "/predict/BTC%2F5M%25"],
    ["/predict/BTC%2F5M%25", "/predict/BTC%2F5M%25"],
    ["/markets", "/markets"],
  ])("preserves direct entry suffixes: %s", (pathname, expected) => {
    expect(
      localizeEntryPath("zh", {
        pathname,
        search: "?network=test",
        hash: "#orders",
      }),
    ).toBe(`/zh${expected}?network=test#orders`);
  });
});
