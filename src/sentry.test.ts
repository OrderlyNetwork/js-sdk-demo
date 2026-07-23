import { createBrowserRouter } from "react-router";
import type { ErrorEvent } from "@sentry/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createSentryBeforeSend,
  getSentryCreateBrowserRouter,
  initSentryBrowser,
  matchesSentryIgnoredError,
  resolveSentryEnvironment,
  resolveSentryTracesSampleRate,
  setSentryUserAddress,
} from "./sentry";

const sentryMocks = vi.hoisted(() => ({
  init: vi.fn(),
  reactRouterV7BrowserTracingIntegration: vi.fn(() => ({})),
  setUser: vi.fn(),
  wrapCreateBrowserRouter: vi.fn(),
}));

vi.mock("@sentry/react", () => ({
  init: sentryMocks.init,
  reactRouterV7BrowserTracingIntegration:
    sentryMocks.reactRouterV7BrowserTracingIntegration,
  setUser: sentryMocks.setUser,
  wrapCreateBrowserRouter: sentryMocks.wrapCreateBrowserRouter,
}));

describe("Sentry configuration", () => {
  beforeEach(() => {
    sentryMocks.init.mockReset();
    sentryMocks.reactRouterV7BrowserTracingIntegration.mockClear();
    sentryMocks.setUser.mockReset();
    sentryMocks.wrapCreateBrowserRouter.mockReset();
  });

  it("does not block application startup when initialization fails", () => {
    const error = new Error("Sentry unavailable");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    sentryMocks.init.mockImplementationOnce(() => {
      throw error;
    });

    expect(() => initSentryBrowser()).not.toThrow();
    expect(getSentryCreateBrowserRouter()).toBe(createBrowserRouter);
    expect(warn).toHaveBeenCalledWith("Sentry initialization failed", error);

    warn.mockRestore();
  });

  it("wraps the router only after initialization succeeds", () => {
    const wrappedRouterFactory = vi.fn();
    sentryMocks.wrapCreateBrowserRouter.mockReturnValue(wrappedRouterFactory);

    initSentryBrowser();

    expect(getSentryCreateBrowserRouter()).toBe(wrappedRouterFactory);
    expect(sentryMocks.init.mock.invocationCallOrder[0]).toBeLessThan(
      sentryMocks.wrapCreateBrowserRouter.mock.invocationCallOrder[0],
    );
  });

  it("uses prod when the runtime environment is unavailable", () => {
    expect(resolveSentryEnvironment()).toBe("prod");
    expect(resolveSentryEnvironment("qa")).toBe("qa");
  });

  it.each([
    ["dev", 1],
    ["qa", 1],
    ["staging", 1],
    ["prod", 0.2],
    ["prod-iap", 0.2],
  ] as const)("uses a %s sample rate of %s", (environment, expected) => {
    expect(resolveSentryTracesSampleRate(environment)).toBe(expected);
  });

  it("filters expected browser, wallet, and chunk-loading noise", () => {
    expect(matchesSentryIgnoredError("Failed to fetch")).toBe(true);
    expect(matchesSentryIgnoredError("User rejected transaction")).toBe(true);
    expect(matchesSentryIgnoredError("ChunkLoadError: loading failed")).toBe(
      true,
    );
    expect(matchesSentryIgnoredError("Unexpected application failure")).toBe(
      false,
    );
  });

  it("sends matching property errors only once per session", () => {
    const beforeSend = createSentryBeforeSend();
    const event = {
      exception: {
        values: [{ value: "Cannot read properties of undefined" }],
      },
    } as ErrorEvent;

    expect(beforeSend(event, {})).toBe(event);
    expect(beforeSend(event, {})).toBeNull();
  });

  it("does not deduplicate unrelated errors", () => {
    const beforeSend = createSentryBeforeSend();
    const event = {
      exception: {
        values: [{ value: "Unexpected application failure" }],
      },
    } as ErrorEvent;

    expect(beforeSend(event, {})).toBe(event);
    expect(beforeSend(event, {})).toBe(event);
  });

  it("sets and clears the current wallet address", () => {
    setSentryUserAddress("0x1234");
    setSentryUserAddress();

    expect(sentryMocks.setUser).toHaveBeenNthCalledWith(1, { id: "0x1234" });
    expect(sentryMocks.setUser).toHaveBeenNthCalledWith(2, null);
  });
});
