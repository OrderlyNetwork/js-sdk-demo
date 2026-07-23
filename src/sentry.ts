import { useEffect } from "react";
import {
  createBrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router";
import * as Sentry from "@sentry/react";
import type { BrowserOptions } from "@sentry/react";
import type { AppEnv } from "@/config/runtime";
import { getRuntimeConfig } from "@/config/runtime";

export const SENTRY_DSN =
  "https://285a60f69d6747c68f5b5803d1bc2df3@o4510468552654848.ingest.us.sentry.io/4511783147143168";

export const sentryIgnoreErrors: BrowserOptions["ignoreErrors"] = [
  /Script error/,

  /NetworkError when attempting to fetch resource/,
  /Failed to fetch/,
  /Network request failed/,
  /Load failed/,
  /net::ERR_/,
  /NetworkError/,
  /Network Error/,

  /Object captured as promise rejection with/,
  /Non-Error promise rejection captured/,
  /Non-Error exception captured/,

  /AbortError: The user aborted a request/,
  /User rejected/,
  /User denied/,
  /User cancelled/,
  /User canceled/,
  /rejected by user/,
  /User rejected the request/,

  /Failed to execute 'json' on 'Response'/,
  /Failed to execute 'text' on 'Response'/,
  /Response\.json\(\) failed/,

  /Extension context invalidated/,
  /chrome-extension:/,
  /moz-extension:/,
  /safari-extension:/,
  /__chrome_extension/,

  /uBlock/,
  /Adblock/,
  /adblock/,

  /ResizeObserver loop limit exceeded/,
  /ResizeObserver loop completed with undelivered notifications/,

  /Blocked a frame with origin/,
  /Cross-Origin/,
  /CORS/,

  /SecurityError/,
  /NotAllowedError/,
  /NotSupportedError/,

  /User rejected transaction/,
  /User rejected signature/,
  /User rejected the transaction/,
  /User rejected the signature/,
  /Transaction was rejected/,
  /Transaction rejected/,
  /REJECTED_TRANSACTION/,

  /Failed to fetch dynamically imported module/,
  /Loading chunk/,
  /Loading CSS chunk/,
  /ChunkLoadError/,
  /Loading chunk [\d]+ failed/,
  /Loading CSS chunk [\d]+ failed/,

  /Failed to execute 'getValue' on 'CookieDeprecationLabel'/,
  /Cookie was rejected/,

  /Content-Length header of network response exceeds response Body/,
];

const logOnceMessages = [
  /Cannot read properties of/,
  /Cannot set properties of/,
];

let sentryInitialized = false;

export const resolveSentryEnvironment = (appEnv?: AppEnv): AppEnv => {
  return appEnv ?? "prod";
};

export const resolveSentryTracesSampleRate = (environment: AppEnv): number => {
  return environment === "prod" || environment === "prod-iap" ? 0.2 : 1;
};

export const matchesSentryIgnoredError = (message: string): boolean => {
  return Boolean(
    sentryIgnoreErrors?.some((filter) =>
      typeof filter === "string" ? filter === message : filter.test(message),
    ),
  );
};

export const createSentryBeforeSend = (): NonNullable<
  BrowserOptions["beforeSend"]
> => {
  const onceMessageSet = new Set<string>();

  return (event) => {
    const value = event.exception?.values?.[0]?.value;

    if (!value) {
      return event;
    }

    if (onceMessageSet.has(value)) {
      return null;
    }

    if (logOnceMessages.some((filter) => filter.test(value))) {
      onceMessageSet.add(value);
    }

    return event;
  };
};

export const setSentryUserAddress = (address?: string): void => {
  Sentry.setUser(address ? { id: address } : null);
};

export function initSentryBrowser(): void {
  const environment = resolveSentryEnvironment(getRuntimeConfig()?.APP_ENV);

  sentryInitialized = false;

  try {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment,
      sendDefaultPii: false,
      tracesSampleRate: resolveSentryTracesSampleRate(environment),
      ignoreErrors: sentryIgnoreErrors,
      beforeSend: createSentryBeforeSend(),
      integrations: [
        Sentry.reactRouterV7BrowserTracingIntegration({
          useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes,
        }),
      ],
    });
    sentryInitialized = true;
  } catch (error) {
    console.warn("Sentry initialization failed", error);
  }
}

export function getSentryCreateBrowserRouter(): typeof createBrowserRouter {
  if (!sentryInitialized) {
    return createBrowserRouter;
  }

  try {
    return Sentry.wrapCreateBrowserRouter(createBrowserRouter);
  } catch (error) {
    console.warn("Sentry router instrumentation failed", error);
    return createBrowserRouter;
  }
}
