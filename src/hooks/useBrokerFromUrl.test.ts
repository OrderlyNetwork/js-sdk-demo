import { describe, expect, it } from "vitest";
import { resolveBrokerConfig } from "./useBrokerFromUrl";

const defaults = {
  brokerId: "demo",
  brokerName: "Orderly",
};

describe("resolveBrokerConfig", () => {
  it("applies URL broker overrides on testnet", () => {
    const result = resolveBrokerConfig(
      "testnet",
      new URLSearchParams("brokerId=woofi_pro&brokerName=WOOFi"),
      defaults,
    );

    expect(result).toEqual({
      brokerId: "woofi_pro",
      brokerName: "WOOFi",
    });
  });

  it("ignores URL broker overrides on mainnet", () => {
    const result = resolveBrokerConfig(
      "mainnet",
      new URLSearchParams("brokerId=woofi_pro&brokerName=WOOFi"),
      defaults,
    );

    expect(result).toEqual(defaults);
  });

  it("falls back to defaults when URL params are missing", () => {
    const result = resolveBrokerConfig(
      "testnet",
      new URLSearchParams(""),
      defaults,
    );

    expect(result).toEqual(defaults);
  });

  it("overrides only the provided URL fields on testnet", () => {
    const result = resolveBrokerConfig(
      "testnet",
      new URLSearchParams("brokerId=woofi_pro"),
      defaults,
    );

    expect(result).toEqual({
      brokerId: "woofi_pro",
      brokerName: "Orderly",
    });
  });

  it("treats empty URL values as missing", () => {
    const result = resolveBrokerConfig(
      "testnet",
      new URLSearchParams("brokerId=&brokerName="),
      defaults,
    );

    expect(result).toEqual(defaults);
  });

  it("treats whitespace-only URL values as missing", () => {
    const params = new URLSearchParams();
    params.set("brokerId", "  ");
    params.set("brokerName", "  ");

    expect(resolveBrokerConfig("testnet", params, defaults)).toEqual(defaults);
  });
});
