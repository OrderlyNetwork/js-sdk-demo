import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { access, mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test } from "vitest";

const require = createRequire(import.meta.url);
const {
  createSafeHttpsRemoteUrl,
  redactSecrets,
  withGitAskPass,
} = require("./releaseCredentials");

const temporaryRoots = [];

describe("release credentials", () => {
  afterEach(async () => {
    await Promise.all(
      temporaryRoots
        .splice(0)
        .map((directory) => rm(directory, { recursive: true, force: true })),
    );
  });

  test("uses an AskPass script without embedding Git credentials", async () => {
    const username = "release-user";
    const token = "git-secret-token";
    const tempRoot = await createTemporaryRoot();
    let askPassPath;

    await withGitAskPass({ username, token, tempRoot }, async (context) => {
      askPassPath = context.askPassPath;
      const content = await readFile(askPassPath, "utf8");
      const fileStat = await stat(askPassPath);

      expect(content).not.toContain(username);
      expect(content).not.toContain(token);
      expect(fileStat.mode & 0o777).toBe(0o700);
      expect(context.env.GIT_TERMINAL_PROMPT).toBe("0");

      const usernameResult = await execFileAsync(
        askPassPath,
        ["Username for 'https://gitlab.com':"],
        { env: context.env },
      );
      const passwordResult = await execFileAsync(
        askPassPath,
        ["Password for 'https://gitlab.com':"],
        { env: context.env },
      );

      expect(usernameResult.stdout.trim()).toBe(username);
      expect(passwordResult.stdout.trim()).toBe(token);
    });

    await assertPathMissing(askPassPath);
  });

  test("cleans up AskPass after callback failure", async () => {
    const tempRoot = await createTemporaryRoot();
    let askPassPath;

    await expect(
      withGitAskPass(
        { username: "release-user", token: "git-secret-token", tempRoot },
        async (context) => {
          askPassPath = context.askPassPath;
          throw new Error("push failed");
        },
      ),
    ).rejects.toThrow("push failed");

    await assertPathMissing(askPassPath);
  });

  test("removes credentials from supported Git remote URLs", () => {
    expect(
      createSafeHttpsRemoteUrl(
        "https://release-user:git-secret-token@gitlab.com/group/repo.git",
      ),
    ).toBe("https://gitlab.com/group/repo.git");
    expect(createSafeHttpsRemoteUrl("git@gitlab.com:group/repo.git")).toBe(
      "https://gitlab.com/group/repo.git",
    );
    expect(
      createSafeHttpsRemoteUrl(
        "ssh://git@gitlab.example.com/group/nested/repo.git",
      ),
    ).toBe("https://gitlab.example.com/group/nested/repo.git");
  });

  test("redacts raw, encoded, environment, and URL-embedded credentials", () => {
    const explicitToken = "git-secret:/token";
    const environmentToken = "environment-secret";
    const message = [
      explicitToken,
      encodeURIComponent(explicitToken),
      environmentToken,
      "https://release-user:url-secret@gitlab.com/group/repo.git",
    ].join(" ");

    const redacted = redactSecrets(message, [explicitToken], {
      GIT_TOKEN: environmentToken,
    });

    expect(redacted).not.toMatch(
      /git-secret|environment-secret|release-user|url-secret/,
    );
    expect(redacted).toContain("[REDACTED]");
  });
});

async function createTemporaryRoot() {
  const directory = await mkdtemp(path.join(tmpdir(), "release-auth-test-"));
  temporaryRoots.push(directory);
  return directory;
}

async function assertPathMissing(filePath) {
  await assert.rejects(access(filePath), { code: "ENOENT" });
}

function execFileAsync(file, args, options) {
  return new Promise((resolve, reject) => {
    execFile(file, args, options, (error, stdout, stderr) => {
      if (error) {
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
        return;
      }

      resolve({ stderr, stdout });
    });
  });
}
