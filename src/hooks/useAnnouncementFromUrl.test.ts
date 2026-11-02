import { describe, expect, it } from "vitest";
import { resolveAnnouncementConfig } from "./useAnnouncementFromUrl";

describe("resolveAnnouncementConfig", () => {
  it.each([
    ["true", true],
    ["false", false],
    [" true ", true],
    [" false ", false],
    ["", false],
    ["  ", false],
    ["1", false],
    ["0", false],
    ["TRUE", false],
    ["False", false],
    ["invalid", false],
  ])("resolves testnet value %j to %s", (value, expected) => {
    expect(
      resolveAnnouncementConfig(
        "testnet",
        new URLSearchParams({ excludeOfficial: value }),
      ),
    ).toEqual({ excludeOfficial: expected });
  });

  it.each(["testnet", "mainnet"] as const)(
    "defaults to false on %s",
    (networkId) => {
      expect(
        resolveAnnouncementConfig(networkId, new URLSearchParams()),
      ).toEqual({ excludeOfficial: false });
    },
  );

  it.each(["true", "false", " true ", "invalid", ""])(
    "ignores the mainnet URL override %j",
    (value) => {
      expect(
        resolveAnnouncementConfig(
          "mainnet",
          new URLSearchParams({ excludeOfficial: value }),
        ),
      ).toEqual({ excludeOfficial: false });
    },
  );
});
