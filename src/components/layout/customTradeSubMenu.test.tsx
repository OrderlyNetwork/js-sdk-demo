// RightSection is exercised as a plain function with mocked hooks, matching
// the useNav.test.ts convention; effects are collected and run in order.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ORDERLY_SYMBOL_KEY } from "@/storage";
import { RightSection } from "./customTradeSubMenu";

const harness = vi.hoisted(() => {
  const state: { symbol?: string } = {};
  const effects: Array<() => void> = [];
  const route: { symbol?: string; pathname: string } = { pathname: "" };
  return {
    route,
    reset() {
      state.symbol = undefined;
      effects.length = 0;
    },
    effects,
    setState(next: string) {
      state.symbol = next;
    },
  };
});

vi.mock("react", () => ({
  default: {
    createElement: (type: unknown, props: unknown, ...children: unknown[]) => ({
      type,
      props,
      children,
    }),
    Fragment: "react-fragment",
  },
  useCallback: (cb: unknown) => cb,
  useEffect: (cb: () => void) => {
    harness.effects.push(cb);
  },
  useState: (init: unknown) => [
    typeof init === "function" ? init() : init,
    harness.setState,
  ],
}));

vi.mock("react-router", () => ({
  useParams: () => ({ symbol: harness.route.symbol }),
  useLocation: () => ({ pathname: harness.route.pathname }),
}));

vi.mock("@/hooks/useNav", () => ({
  useNav: () => ({ onRouteChange: () => {} }),
}));

vi.mock("@orderly.network/markets", () => ({
  SubMenuMarketsWidget: () => null,
}));

vi.mock("@orderly.network/ui", () => ({
  TradingActiveIcon: () => null,
  TradingInactiveIcon: () => null,
  PredictionIcon: () => null,
}));

vi.mock("@orderly.network/i18n", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

let store: Map<string, string>;

beforeEach(() => {
  store = new Map();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
  });
  harness.reset();
});

function renderRightSection() {
  RightSection({ className: "" });
  for (const effect of [...harness.effects]) effect();
}

describe("RightSection symbol mirroring", () => {
  it("mirrors the URL symbol into storage on a perps route", () => {
    harness.route.symbol = "PERP_BTC_USDC";
    harness.route.pathname = "/en/perp/PERP_BTC_USDC";
    renderRightSection();
    expect(store.get(ORDERLY_SYMBOL_KEY)).toBe("PERP_BTC_USDC");
  });

  it("does not overwrite the remembered symbol with the prediction round symbol", () => {
    store.set(ORDERLY_SYMBOL_KEY, "PERP_BTC_USDC");
    harness.route.symbol = "PERP_BTC5M2608271200_USDC";
    harness.route.pathname = "/en/prediction/PERP_BTC5M2608271200_USDC";
    renderRightSection();
    expect(store.get(ORDERLY_SYMBOL_KEY)).toBe("PERP_BTC_USDC");
  });

  it("keeps the remembered symbol on routes without a perps symbol param", () => {
    store.set(ORDERLY_SYMBOL_KEY, "PERP_BTC_USDC");
    harness.route.symbol = undefined;
    harness.route.pathname = "/en/markets";
    renderRightSection();
    expect(store.get(ORDERLY_SYMBOL_KEY)).toBe("PERP_BTC_USDC");
  });
});
