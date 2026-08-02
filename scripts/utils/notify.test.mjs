import { createRequire } from "node:module";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const require = createRequire(import.meta.url);
const { notify, notifySafely } = require("./notify.js");

const notificationEnvironmentVariables = [
  "TELEGRAM_TOKEN",
  "TELEGRAM_CHAT_ID",
  "SLACK_WEBHOOK_URL",
];
const originalEnvironment = Object.fromEntries(
  notificationEnvironmentVariables.map((name) => [name, process.env[name]]),
);
const originalFetch = global.fetch;
const originalConsole = {
  error: console.error,
  log: console.log,
  warn: console.warn,
};

describe("notify", () => {
  beforeEach(() => {
    notificationEnvironmentVariables.forEach((name) => {
      delete process.env[name];
    });
    console.error = () => {};
    console.log = () => {};
    console.warn = () => {};
  });

  afterEach(() => {
    vi.useRealTimers();
    global.fetch = originalFetch;
    console.error = originalConsole.error;
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;

    notificationEnvironmentVariables.forEach((name) => {
      const value = originalEnvironment[name];
      if (value === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = value;
      }
    });
  });

  it("sends the message to Telegram and Slack", async () => {
    configureTelegram();
    process.env.SLACK_WEBHOOK_URL =
      "https://hooks.slack.test/services/example";
    const requests = [];
    global.fetch = async (url, options) => {
      requests.push({ url, options });
      return response();
    };

    await notify("release completed");

    expect(requests).toHaveLength(2);
    expect(requests[0]).toEqual({
      url: "https://api.telegram.org/bottelegram-token/sendMessage",
      options: {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: expect.any(AbortSignal),
        body: JSON.stringify({
          chat_id: "telegram-chat-id",
          text: "<pre>release completed</pre>",
          parse_mode: "HTML",
        }),
      },
    });
    expect(requests[1]).toEqual({
      url: "https://hooks.slack.test/services/example",
      options: {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: expect.any(AbortSignal),
        body: JSON.stringify({ text: "release completed" }),
      },
    });
  });

  it("sends only to each configured provider", async () => {
    configureTelegram();
    const telegramRequests = [];
    global.fetch = async (url) => {
      telegramRequests.push(url);
      return response();
    };

    await notify("telegram message");

    expect(telegramRequests).toEqual([
      "https://api.telegram.org/bottelegram-token/sendMessage",
    ]);

    delete process.env.TELEGRAM_TOKEN;
    delete process.env.TELEGRAM_CHAT_ID;
    process.env.SLACK_WEBHOOK_URL =
      "https://hooks.slack.test/services/example";
    const slackRequests = [];
    global.fetch = async (url) => {
      slackRequests.push(url);
      return response();
    };

    await notify("slack message");

    expect(slackRequests).toEqual([
      "https://hooks.slack.test/services/example",
    ]);
  });

  it("formats notification links for Telegram and Slack", async () => {
    configureTelegram();
    process.env.SLACK_WEBHOOK_URL =
      "https://hooks.slack.test/services/example";
    const requests = [];
    global.fetch = async (url, options) => {
      requests.push({ url, body: JSON.parse(options.body) });
      return response();
    };
    const link = {
      label: "View Job",
      url: "https://gitlab.com/example/jobs/123?a=1&b=2",
    };

    await notify("job failed", { link });

    expect(requests[0].body.text).toBe(
      '<pre>job failed</pre>\n<a href="https://gitlab.com/example/jobs/123?a=1&amp;b=2">View Job</a>',
    );
    expect(requests[1].body.text).toBe(
      "job failed\n<https://gitlab.com/example/jobs/123?a=1&amp;b=2|View Job>",
    );
  });

  it("does not send or throw when no provider is configured", async () => {
    let requestCount = 0;
    let warning;
    global.fetch = async () => {
      requestCount += 1;
      return response();
    };
    console.warn = (message) => {
      warning = message;
    };

    await notify("message");

    expect(requestCount).toBe(0);
    expect(warning).toBe("No notification provider configured");
  });

  it("attempts every provider and aggregates failures", async () => {
    configureTelegram();
    process.env.SLACK_WEBHOOK_URL =
      "https://hooks.slack.test/services/example";
    const requests = [];
    global.fetch = async (url) => {
      requests.push(url);
      return url.includes("telegram")
        ? response({ ok: false, status: 400, body: "telegram rejected" })
        : response({ ok: false, status: 500, body: "slack rejected" });
    };

    await expect(notify("message")).rejects.toMatchObject({
      message: "Failed to send notifications: Telegram, Slack",
      errors: [
        expect.objectContaining({ message: expect.stringMatching(/Telegram/) }),
        expect.objectContaining({ message: expect.stringMatching(/Slack/) }),
      ],
    });
    expect(requests).toHaveLength(2);
  });

  it("reports only failed providers when another provider succeeds", async () => {
    configureTelegram();
    process.env.SLACK_WEBHOOK_URL =
      "https://hooks.slack.test/services/example";
    global.fetch = async (url) =>
      url.includes("telegram")
        ? response({ ok: false, status: 400, body: "bad request" })
        : response();

    await expect(notify("message")).rejects.toMatchObject({
      message: "Failed to send notifications: Telegram",
      errors: [
        expect.objectContaining({ message: expect.stringMatching(/Telegram/) }),
      ],
    });
  });

  it("does not throw when a best-effort notification cannot be sent", async () => {
    process.env.SLACK_WEBHOOK_URL =
      "https://hooks.slack.test/services/example";
    const errors = [];
    console.error = (...args) => errors.push(args.join(" "));
    global.fetch = async () =>
      response({ ok: false, status: 500, body: "slack rejected" });

    await expect(notifySafely("release failed")).resolves.toBeUndefined();

    expect(errors.join("\n")).toMatch(
      /Failed to send notification: Failed to send notifications: Slack/,
    );
  });

  it("aborts a notification request after the configured timeout", async () => {
    vi.useFakeTimers();
    configureTelegram();
    global.fetch = async (_url, { signal }) =>
      new Promise((_, reject) => {
        signal.addEventListener("abort", () => reject(signal.reason));
      });

    const notification = notify("release failed").then(
      () => null,
      (error) => error,
    );
    await vi.advanceTimersByTimeAsync(30_000);

    await expect(notification).resolves.toMatchObject({
      message: "Failed to send notifications: Telegram",
      errors: [
        expect.objectContaining({
          message: expect.stringMatching(/timed out after 30000ms/),
        }),
      ],
    });
  });

  it("escapes and truncates Telegram messages by Unicode code point", async () => {
    configureTelegram();
    let telegramBody;
    global.fetch = async (_url, options) => {
      telegramBody = JSON.parse(options.body);
      return response();
    };
    const message = `<tag attr="value">Tom & Jerry's</tag>😀${"a".repeat(4096)}`;

    await notify(message);

    expect(telegramBody.text).toMatch(
      /^<pre>&lt;tag attr=&quot;value&quot;&gt;Tom &amp; Jerry&#39;s&lt;\/tag&gt;😀/,
    );
    expect(Array.from(decodeTelegramMessage(telegramBody.text))).toHaveLength(
      4096,
    );
  });

  it("reserves Telegram message space for a link label", async () => {
    configureTelegram();
    let telegramBody;
    global.fetch = async (_url, options) => {
      telegramBody = JSON.parse(options.body);
      return response();
    };
    const link = { label: "Job", url: "https://gitlab.com/jobs/123" };

    await notify("a".repeat(4096), { link });

    const preformattedMessage = telegramBody.text.match(
      /^<pre>(.*)<\/pre>\n/,
    )[1];
    expect(Array.from(preformattedMessage)).toHaveLength(4092);
  });

  it("truncates an oversized Telegram link label within the message limit", async () => {
    configureTelegram();
    let telegramBody;
    global.fetch = async (_url, options) => {
      telegramBody = JSON.parse(options.body);
      return response();
    };

    await notify("M".repeat(4096), {
      link: {
        label: "L".repeat(5000),
        url: "https://gitlab.com/jobs/123",
      },
    });

    const match = telegramBody.text.match(
      /^<pre>(.*)<\/pre>\n<a href="[^"]*">(.*)<\/a>$/,
    );
    expect(match).not.toBeNull();
    expect(Array.from(match[1])).toHaveLength(0);
    expect(Array.from(match[2])).toHaveLength(4095);
    expect(Array.from(`${match[1]}\n${match[2]}`)).toHaveLength(4096);
  });

  it("redacts provider credentials from HTTP and network errors", async () => {
    const webhookUrl = "https://hooks.slack.test/services/secret";
    process.env.SLACK_WEBHOOK_URL = webhookUrl;
    const errors = [];
    console.error = (...args) => errors.push(args.join(" "));
    global.fetch = async () =>
      response({
        ok: false,
        status: 403,
        body: `invalid webhook ${webhookUrl}`,
      });

    await expect(notify("message")).rejects.toSatisfy((error) => {
      expect(error.errors[0].message).toMatch(/invalid webhook/);
      expect(error.errors[0].message).not.toContain(webhookUrl);
      return true;
    });
    expect(errors.join("\n")).not.toContain(webhookUrl);

    configureTelegram();
    delete process.env.SLACK_WEBHOOK_URL;
    global.fetch = async (url) => {
      throw new Error(`request to ${url} with telegram-token failed`);
    };

    await expect(notify("message")).rejects.toSatisfy((error) => {
      expect(error.errors[0].message).not.toContain("telegram-token");
      expect(error.errors[0].message).toContain("[REDACTED]");
      return true;
    });
  });
});

function configureTelegram() {
  process.env.TELEGRAM_TOKEN = "telegram-token";
  process.env.TELEGRAM_CHAT_ID = "telegram-chat-id";
}

function response({ ok = true, status = 200, body = "ok" } = {}) {
  return {
    ok,
    status,
    text: async () => body,
  };
}

function decodeTelegramMessage(message) {
  return message
    .replace(/^<pre>|<\/pre>$/g, "")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");
}
