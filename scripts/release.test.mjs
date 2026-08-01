import { execFile } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";
import { $ } from "zx";

const require = createRequire(import.meta.url);
const {
  assertOnlyReleaseFilesChanged,
  checkGitStatus,
  getInitialTag,
  getLatestRemoteTag,
  getNextTag,
  getReleaseConfig,
  main,
  parseReleaseTag,
  pushReleaseCommitAndTag,
  resolveTagVersion,
  validateReleaseConfig,
} = require("./release");

const temporaryRoots = [];

describe("release configuration", () => {
  test("prefers APP_TARGET and validates a complete CI configuration", () => {
    const config = getReleaseConfig({
      APP_TARGET: "dmm",
      CI_COMMIT_BRANCH: "release/next",
      GIT_TOKEN: "token",
      GIT_USERNAME: "release-user",
      PACKAGE_VERSION: "3.1.7-internal-improve-theme.3",
      TRIGGER_BRANCH: "release/next",
      VITE_APP_TARGET: "demo",
    });

    expect(config.appTarget).toBe("dmm");
    expect(config.isCI).toBe(true);
    expect(() => validateReleaseConfig(config)).not.toThrow();
  });

  test("falls back to VITE_APP_TARGET for local releases", () => {
    const config = getReleaseConfig({
      PACKAGE_VERSION: "3.2.0",
      VITE_APP_TARGET: "demo",
    });

    expect(config.appTarget).toBe("demo");
    expect(config.isCI).toBe(false);
    expect(() => validateReleaseConfig(config)).not.toThrow();
  });

  test.each([
    ["missing package version", { APP_TARGET: "demo" }, /PACKAGE_VERSION/],
    [
      "invalid application target",
      { APP_TARGET: "storybook", PACKAGE_VERSION: "3.2.0" },
      /demo.*dmm/,
    ],
    [
      "missing trigger branch",
      {
        APP_TARGET: "demo",
        CI_COMMIT_BRANCH: "release/next",
        GIT_TOKEN: "token",
        GIT_USERNAME: "release-user",
        PACKAGE_VERSION: "3.2.0",
      },
      /TRIGGER_BRANCH/,
    ],
    [
      "mismatched CI branch",
      {
        APP_TARGET: "demo",
        CI_COMMIT_BRANCH: "release/actual",
        GIT_TOKEN: "token",
        GIT_USERNAME: "release-user",
        PACKAGE_VERSION: "3.2.0",
        TRIGGER_BRANCH: "release/requested",
      },
      /must match/,
    ],
    [
      "missing CI credentials",
      {
        APP_TARGET: "demo",
        CI_COMMIT_BRANCH: "release/next",
        PACKAGE_VERSION: "3.2.0",
        TRIGGER_BRANCH: "release/next",
      },
      /GIT_USERNAME, GIT_TOKEN/,
    ],
  ])("rejects %s before release execution", (_name, env, errorPattern) => {
    expect(() => validateReleaseConfig(getReleaseConfig(env))).toThrow(
      errorPattern,
    );
  });

  test("redacts release errors and preserves them when notification fails", async () => {
    const token = "git-secret-token";
    const notify = vi.fn().mockRejectedValue(new Error("notification failed"));
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    await expect(
      main({
        env: {
          APP_TARGET: "demo",
          CI_COMMIT_BRANCH: "release/next",
          GIT_TOKEN: token,
          GIT_USERNAME: "release-user",
          PACKAGE_VERSION: token,
          TRIGGER_BRANCH: "release/next",
        },
        notify,
      }),
    ).rejects.toThrow(token);

    expect(notify).toHaveBeenCalledOnce();
    expect(JSON.stringify(notify.mock.calls)).not.toContain(token);
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(token);
  });
});

describe("release versions and tags", () => {
  test.each([
    ["3.2.0", "3.2.0"],
    ["3.1.7-internal-improve-theme.3", "3.1.6"],
    ["0.0.0-internal-20251009.1", "0.0.0"],
  ])("resolves %s to tag version %s", (packageVersion, tagVersion) => {
    expect(resolveTagVersion(packageVersion)).toBe(tagVersion);
  });

  test.each([
    "3.2.0-beta.1",
    "3.1.7-internal-improve-theme",
    "03.1.7",
    "3.1.7-internal-improve_theme.3",
  ])("rejects unsupported version %s", (version) => {
    expect(() => resolveTagVersion(version)).toThrow();
  });

  test("creates and increments exact target tags", () => {
    expect(getInitialTag("3.1.6", "demo")).toBe("v3.1.6.0-demo");
    expect(getNextTag("v3.1.6.9-demo", "demo")).toBe("v3.1.6.10-demo");
    expect(parseReleaseTag("v3.1.6.9-demo", "demo")).toEqual({
      sequence: 9,
      version: "3.1.6",
    });
  });

  test.each([
    "v3.1.6.01-demo",
    "prefix-v3.1.6.1-demo",
    "v3.1.6.1-demo-extra",
    "v3.1.6.1-dmm",
  ])("rejects malformed or mismatched tag %s", (tag) => {
    expect(parseReleaseTag(tag, "demo")).toBeNull();
    expect(() => getNextTag(tag, "demo")).toThrow("Invalid tag");
  });
});

describe("release Git safety", () => {
  afterEach(async () => {
    await Promise.all(
      temporaryRoots
        .splice(0)
        .map((directory) => rm(directory, { recursive: true, force: true })),
    );
  });

  test("rejects a dirty working tree", async () => {
    const repository = await createRepository();
    const command = $({ cwd: repository.local, quiet: true, verbose: false });

    await checkGitStatus(command);
    await writeFile(path.join(repository.local, "untracked.txt"), "dirty\n");

    await expect(checkGitStatus(command)).rejects.toThrow(
      "There are uncommitted changes",
    );
  });

  test("rejects files outside the release allowlist", async () => {
    const repository = await createRepository();
    const command = $({ cwd: repository.local, quiet: true, verbose: false });

    await writeFile(path.join(repository.local, "package.json"), "{}\n");
    await writeFile(path.join(repository.local, "unexpected.txt"), "dirty\n");

    await expect(assertOnlyReleaseFilesChanged(command)).rejects.toThrow(
      "Unexpected files changed during release: unexpected.txt",
    );
  });

  test("uses only exact remote tags to determine the latest sequence", async () => {
    const repository = await createRepository();
    const command = $({ cwd: repository.local, quiet: true, verbose: false });

    for (const tag of [
      "v3.2.0.1-demo",
      "v3.2.0.9-demo",
      "v3.2.0.10-dmm",
      "v3.2.0.010-demo",
    ]) {
      await git(repository.local, "tag", tag);
      await git(repository.local, "push", "origin", tag);
    }
    await git(repository.local, "tag", "v3.2.0.20-demo");

    await expect(
      getLatestRemoteTag("origin", "3.2.0", "demo", command),
    ).resolves.toBe("v3.2.0.9-demo");
  });

  test("atomically pushes the release commit and tag", async () => {
    const repository = await createRepository();
    const command = $({ cwd: repository.local, quiet: true, verbose: false });
    const releaseTag = "v3.2.0.0-demo";

    await commitFile(repository.local, "release.txt", "release\n", "release");
    const localHead = await revParse(repository.local, "HEAD");

    await pushReleaseCommitAndTag({
      command,
      remote: "origin",
      releaseTag,
      targetBranch: "main",
    });

    expect(await revParse(repository.remote, "refs/heads/main")).toBe(
      localHead,
    );
    expect(await revParse(repository.remote, `refs/tags/${releaseTag}`)).toBe(
      localHead,
    );
  });

  test("leaves both remote refs unchanged and removes the local tag on conflict", async () => {
    const repository = await createRepository();
    const command = $({ cwd: repository.local, quiet: true, verbose: false });
    const competitor = path.join(repository.root, "competitor");
    const releaseTag = "v3.2.0.0-demo";

    await commitFile(repository.local, "release.txt", "release\n", "release");
    await git(repository.root, "clone", repository.remote, competitor);
    await configureRepository(competitor);
    await commitFile(competitor, "competitor.txt", "competitor\n", "compete");
    await git(competitor, "push", "origin", "main");
    const remoteHeadBeforeRelease = await revParse(
      repository.remote,
      "refs/heads/main",
    );

    await expect(
      pushReleaseCommitAndTag({
        command,
        remote: "origin",
        releaseTag,
        targetBranch: "main",
      }),
    ).rejects.toBeDefined();

    expect(await revParse(repository.remote, "refs/heads/main")).toBe(
      remoteHeadBeforeRelease,
    );
    await expect(
      revParse(repository.remote, `refs/tags/${releaseTag}`),
    ).rejects.toBeDefined();
    await expect(
      revParse(repository.local, `refs/tags/${releaseTag}`),
    ).rejects.toBeDefined();
  });
});

async function createRepository() {
  const root = await mkdtemp(path.join(tmpdir(), "release-git-test-"));
  temporaryRoots.push(root);
  const local = path.join(root, "local");
  const remote = path.join(root, "remote.git");

  await mkdir(local);
  await git(root, "init", "--bare", remote);
  await git(local, "init", "-b", "main");
  await configureRepository(local);
  await commitFile(local, "README.md", "base\n", "initial");
  await git(local, "remote", "add", "origin", remote);
  await git(local, "push", "--set-upstream", "origin", "main");

  return { local, remote, root };
}

async function configureRepository(repository) {
  await git(repository, "config", "user.name", "Release Test");
  await git(repository, "config", "user.email", "release@example.com");
  await git(repository, "config", "commit.gpgsign", "false");
}

async function commitFile(repository, filename, content, message) {
  await writeFile(path.join(repository, filename), content);
  await git(repository, "add", filename);
  await git(repository, "commit", "-m", message);
}

async function revParse(repository, ref) {
  const result = await git(repository, "rev-parse", ref);
  return result.stdout.trim();
}

async function git(cwd, ...args) {
  return new Promise((resolve, reject) => {
    execFile("git", args, { cwd }, (error, stdout, stderr) => {
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
