import { describe, expect, it } from "vitest";
import {
  AppEnv,
  RuntimeConfig,
  buildNetworkAppUrl,
  resolveOrderlyConfig,
  resolveNetworkId,
  resolveNetworkSwitch,
  resolveRuntimeConfig,
} from "./runtime";

const createRuntimeConfig = (
  appEnv: AppEnv,
  overrides: Partial<RuntimeConfig> = {},
): RuntimeConfig => ({
  APP_ENV: appEnv,
  MAINNET_APP_URL: "",
  TESTNET_APP_URL: "",
  ...overrides,
});

describe("resolveNetworkId", () => {
  it.each<[AppEnv, "mainnet" | "testnet"]>([
    ["dev", "testnet"],
    ["qa", "testnet"],
    ["staging", "testnet"],
    ["prod", "mainnet"],
    ["prod-iap", "mainnet"],
  ])("maps %s to %s", (appEnv, expected) => {
    expect(resolveNetworkId(appEnv, false)).toBe(expected);
  });

  it("falls back to mainnet when APP_ENV is missing", () => {
    expect(resolveNetworkId(undefined, false)).toBe("mainnet");
  });

  it("allows the browser override to force mainnet", () => {
    expect(resolveNetworkId("staging", true)).toBe("mainnet");
  });
});

describe("resolveRuntimeConfig", () => {
  const containerConfig = createRuntimeConfig("prod", {
    API_BASE_URL: "https://container.example.com",
  });

  it("uses Vite mode configuration during local development", () => {
    expect(
      resolveRuntimeConfig(
        true,
        {
          VITE_APP_ENV: "qa",
          VITE_MAINNET_APP_URL: " https://mainnet.example.com/app/ ",
        },
        containerConfig,
      ),
    ).toEqual({
      APP_ENV: "qa",
      MAINNET_APP_URL: "https://mainnet.example.com/app/",
      TESTNET_APP_URL: "",
      API_BASE_URL: "https://api.qa.orderly-i.network",
      PUBLIC_WS_URL: "wss://ws.qa.orderly-i.network",
      PRIVATE_WS_URL: "wss://ws-private.qa.orderly-i.network",
      OPERATOR_EVM_URL: "https://operator.qa.orderly-i.network",
      OPERATOR_SOLANA_URL: "https://sol-operator.qa.orderly-i.network",
    });
  });

  it("uses container runtime configuration in production builds", () => {
    expect(
      resolveRuntimeConfig(
        false,
        {
          VITE_APP_ENV: "qa",
        },
        containerConfig,
      ),
    ).toBe(containerConfig);
  });
});

describe("resolveOrderlyConfig", () => {
  it("falls back to the prod environment and mainnet endpoints", () => {
    expect(resolveOrderlyConfig(undefined, false)).toEqual({
      appEnv: undefined,
      networkId: "mainnet",
      sdkEnv: "prod",
      urls: {
        apiBaseUrl: "https://api.orderly.org",
        publicWsUrl: "wss://ws-evm.orderly.org",
        privateWsUrl: "wss://ws-private-evm.orderly.org",
        operatorUrl: {
          EVM: "https://operator-evm.orderly.org",
          SOL: "https://operator-solana.orderly.org",
        },
      },
    });
  });

  it.each<
    [
      AppEnv,
      "mainnet" | "testnet",
      "dev" | "qa" | "staging" | "prod",
      string,
      string,
      string,
      string,
      string,
    ]
  >([
    [
      "dev",
      "testnet",
      "dev",
      "https://api.dev.orderly-i.network",
      "wss://ws.dev.orderly-i.network",
      "wss://ws-private.dev.orderly-i.network",
      "https://operator.dev.orderly-i.network",
      "https://sol-operator.dev.orderly-i.network",
    ],
    [
      "qa",
      "testnet",
      "qa",
      "https://api.qa.orderly-i.network",
      "wss://ws.qa.orderly-i.network",
      "wss://ws-private.qa.orderly-i.network",
      "https://operator.qa.orderly-i.network",
      "https://sol-operator.qa.orderly-i.network",
    ],
    [
      "staging",
      "testnet",
      "staging",
      "https://testnet-api.orderly.org",
      "wss://testnet-ws-evm.orderly.org",
      "wss://testnet-ws-private-evm.orderly.org",
      "https://testnet-operator-evm.orderly.org",
      "https://testnet-operator-sol.orderly.org",
    ],
    [
      "prod",
      "mainnet",
      "prod",
      "https://api.orderly.org",
      "wss://ws-evm.orderly.org",
      "wss://ws-private-evm.orderly.org",
      "https://operator-evm.orderly.org",
      "https://operator-solana.orderly.org",
    ],
    [
      "prod-iap",
      "mainnet",
      "prod",
      "https://api.orderly.org",
      "wss://ws-evm.orderly.org",
      "wss://ws-private-evm.orderly.org",
      "https://operator-evm.orderly.org",
      "https://operator-solana.orderly.org",
    ],
  ])(
    "maps %s to its network, SDK env, and endpoints",
    (
      appEnv,
      networkId,
      sdkEnv,
      apiBaseUrl,
      publicWsUrl,
      privateWsUrl,
      evmOperatorUrl,
      solanaOperatorUrl,
    ) => {
      const runtimeConfig = resolveRuntimeConfig(
        true,
        { VITE_APP_ENV: appEnv },
        undefined,
      );
      const result = resolveOrderlyConfig(runtimeConfig, false);

      expect(result).toEqual({
        appEnv,
        networkId,
        sdkEnv,
        urls: {
          apiBaseUrl,
          publicWsUrl,
          privateWsUrl,
          operatorUrl: {
            EVM: evmOperatorUrl,
            SOL: solanaOperatorUrl,
          },
        },
      });
    },
  );

  it.each([
    ["staging", "https://testnet-api.orderly.org"],
    ["prod", "https://api.orderly.org"],
  ] as const)(
    "falls back to SDK defaults when %s has no local URL overrides",
    (appEnv, expectedApiBaseUrl) => {
      expect(
        resolveOrderlyConfig(createRuntimeConfig(appEnv), false).urls
          .apiBaseUrl,
      ).toBe(expectedApiBaseUrl);
    },
  );

  it("changes only networkId when a testnet environment is overridden", () => {
    const result = resolveOrderlyConfig(
      createRuntimeConfig("qa", {
        API_BASE_URL: "https://api.qa.orderly-i.network",
        PUBLIC_WS_URL: "wss://ws.qa.orderly-i.network",
        PRIVATE_WS_URL: "wss://ws-private.qa.orderly-i.network",
        OPERATOR_EVM_URL: "https://operator.qa.orderly-i.network",
        OPERATOR_SOLANA_URL: "https://sol-operator.qa.orderly-i.network",
      }),
      true,
    );

    expect(result.networkId).toBe("mainnet");
    expect(result.sdkEnv).toBe("qa");
    expect(result.urls).toEqual({
      apiBaseUrl: "https://api.qa.orderly-i.network",
      publicWsUrl: "wss://ws.qa.orderly-i.network",
      privateWsUrl: "wss://ws-private.qa.orderly-i.network",
      operatorUrl: {
        EVM: "https://operator.qa.orderly-i.network",
        SOL: "https://sol-operator.qa.orderly-i.network",
      },
    });
  });

  it("keeps SDK testnet endpoints for an overridden staging environment", () => {
    const result = resolveOrderlyConfig(createRuntimeConfig("staging"), true);

    expect(result.networkId).toBe("mainnet");
    expect(result.sdkEnv).toBe("staging");
    expect(result.urls.apiBaseUrl).toBe("https://testnet-api.orderly.org");
    expect(result.urls.publicWsUrl).toBe("wss://testnet-ws-evm.orderly.org");
    expect(result.urls.privateWsUrl).toBe(
      "wss://testnet-ws-private-evm.orderly.org",
    );
    expect(result.urls.operatorUrl).toEqual({
      EVM: "https://testnet-operator-evm.orderly.org",
      SOL: "https://testnet-operator-sol.orderly.org",
    });
  });
});

describe("buildNetworkAppUrl", () => {
  it("preserves the route, query, and hash when switching origins", () => {
    const destination = buildNetworkAppUrl(
      "https://mainnet.example.com",
      "https://testnet.example.com",
      {
        pathname: "/en/perp/ETH_PERP",
        search: "?ref=campaign",
        hash: "#orders",
      },
    );

    expect(destination.href).toBe(
      "https://mainnet.example.com/en/perp/ETH_PERP?ref=campaign#orders",
    );
  });

  it("replaces matching deployment base paths without duplicating them", () => {
    const destination = buildNetworkAppUrl(
      "https://mainnet.example.com/app/",
      "https://testnet.example.com/app/",
      {
        pathname: "/app/en/perp/ETH_PERP",
        search: "",
        hash: "",
      },
    );

    expect(destination.href).toBe(
      "https://mainnet.example.com/app/en/perp/ETH_PERP",
    );
  });
});

describe("resolveNetworkSwitch", () => {
  const location = {
    pathname: "/en/perp/ETH_PERP",
    search: "?ref=campaign",
    hash: "#orders",
  };

  it("redirects from testnet to the configured mainnet application", () => {
    expect(
      resolveNetworkSwitch({
        networkId: "mainnet",
        appEnvNetworkId: "testnet",
        mainnetOverrideEnabled: false,
        targetAppUrl: "https://mainnet.example.com",
        currentAppUrl: "https://testnet.example.com",
        currentHref:
          "https://testnet.example.com/en/perp/ETH_PERP?ref=campaign#orders",
        location,
      }),
    ).toEqual({
      type: "redirect",
      clearMainnetOverride: false,
      href: "https://mainnet.example.com/en/perp/ETH_PERP?ref=campaign#orders",
    });
  });

  it("clears the override and reloads when returning to the current testnet app", () => {
    expect(
      resolveNetworkSwitch({
        networkId: "testnet",
        appEnvNetworkId: "testnet",
        mainnetOverrideEnabled: true,
        targetAppUrl: "https://testnet.example.com",
        currentAppUrl: "https://testnet.example.com",
        currentHref:
          "https://testnet.example.com/en/perp/ETH_PERP?ref=campaign#orders",
        location,
      }),
    ).toEqual({ type: "reload", clearMainnetOverride: true });
  });

  it("clears the override and redirects from a mainnet app to testnet", () => {
    expect(
      resolveNetworkSwitch({
        networkId: "testnet",
        appEnvNetworkId: "mainnet",
        mainnetOverrideEnabled: true,
        targetAppUrl: "https://testnet.example.com",
        currentAppUrl: "https://mainnet.example.com",
        currentHref:
          "https://mainnet.example.com/en/perp/ETH_PERP?ref=campaign#orders",
        location,
      }),
    ).toEqual({
      type: "redirect",
      clearMainnetOverride: true,
      href: "https://testnet.example.com/en/perp/ETH_PERP?ref=campaign#orders",
    });
  });

  it("reports a missing target URL without redirecting", () => {
    expect(
      resolveNetworkSwitch({
        networkId: "mainnet",
        appEnvNetworkId: "testnet",
        mainnetOverrideEnabled: false,
        targetAppUrl: undefined,
        currentAppUrl: "https://testnet.example.com",
        currentHref: "https://testnet.example.com/en/perp/ETH_PERP",
        location,
      }),
    ).toEqual({ type: "missing-url", clearMainnetOverride: false });
  });

  it("reloads instead of assigning the current URL", () => {
    expect(
      resolveNetworkSwitch({
        networkId: "mainnet",
        appEnvNetworkId: "testnet",
        mainnetOverrideEnabled: false,
        targetAppUrl: "https://testnet.example.com",
        currentAppUrl: "https://testnet.example.com",
        currentHref:
          "https://testnet.example.com/en/perp/ETH_PERP?ref=campaign#orders",
        location,
      }),
    ).toEqual({ type: "reload", clearMainnetOverride: false });
  });
});
