import { describe, expect, it } from "vitest";
import { API_URLS } from "@orderly.network/core";
import { createConfigStore } from "./configStore";

describe("createConfigStore", () => {
  it("stores the demo broker and uses the SDK testnet defaults", () => {
    const store = createConfigStore({
      brokerId: "demo",
      brokerName: "Orderly",
      networkId: "testnet",
      appEnv: "qa",
    });

    expect(store.get("brokerId")).toBe("demo");
    expect(store.get("brokerName")).toBe("Orderly");
    expect(store.get("networkId")).toBe("testnet");
    expect(store.get("env")).toBe("qa");
    expect(store.get("apiBaseUrl")).toBe(API_URLS.testnet.apiBaseUrl);
    expect(store.get("publicWsUrl")).toBe(API_URLS.testnet.publicWsUrl);
    expect(store.get("privateWsUrl")).toBe(API_URLS.testnet.privateWsUrl);
    expect(store.get("operatorUrl")).toBe(API_URLS.testnet.operatorUrl.EVM);
  });

  it("stores the dmm broker and normalizes prod-iap to prod", () => {
    const store = createConfigStore({
      brokerId: "orderly",
      brokerName: "Orderly",
      networkId: "mainnet",
      appEnv: "prod-iap",
    });

    expect(store.get("brokerId")).toBe("orderly");
    expect(store.get("networkId")).toBe("mainnet");
    expect(store.get("env")).toBe("prod");
    expect(store.get("apiBaseUrl")).toBe(API_URLS.mainnet.apiBaseUrl);
  });

  it("falls back to the prod SDK environment", () => {
    const store = createConfigStore({
      brokerId: "demo",
      brokerName: "Orderly",
      networkId: "testnet",
    });

    expect(store.get("env")).toBe("prod");
  });

  it("applies resolved runtime endpoint overrides", () => {
    const store = createConfigStore({
      brokerId: "demo",
      brokerName: "Orderly",
      networkId: "testnet",
      appEnv: "qa",
      urls: {
        apiBaseUrl: "https://api.qa.orderly-i.network",
        publicWsUrl: "wss://ws.qa.orderly-i.network",
        privateWsUrl: "wss://ws-private.qa.orderly-i.network",
        operatorUrl: {
          EVM: "https://operator.qa.orderly-i.network",
          SOL: "https://sol-operator.qa.orderly-i.network",
        },
      },
    });

    expect(store.get("brokerId")).toBe("demo");
    expect(store.get("brokerName")).toBe("Orderly");
    expect(store.get("networkId")).toBe("testnet");
    expect(store.get("env")).toBe("qa");
    expect(store.get("apiBaseUrl")).toBe("https://api.qa.orderly-i.network");
    expect(store.get("publicWsUrl")).toBe("wss://ws.qa.orderly-i.network");
    expect(store.get("privateWsUrl")).toBe(
      "wss://ws-private.qa.orderly-i.network",
    );
    expect(store.getOr("operatorUrl", {})).toEqual({
      EVM: "https://operator.qa.orderly-i.network",
      SOL: "https://sol-operator.qa.orderly-i.network",
    });
  });
});
