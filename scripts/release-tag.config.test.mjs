import { readFile } from "node:fs/promises";
import path from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const originalAppTarget = process.env.VITE_APP_TARGET;
const originalPackageVersion = process.env.PACKAGE_VERSION;

afterEach(() => {
  restoreEnvironmentVariable("VITE_APP_TARGET", originalAppTarget);
  restoreEnvironmentVariable("PACKAGE_VERSION", originalPackageVersion);
});

describe("release tag configuration", () => {
  test.each(["demo", "dmm"])(
    "configures %s tags for dev, qa, app, and prod",
    async (appTarget) => {
      const config = await loadReleaseTagConfig(appTarget);

      expect(config.environments).toEqual(["dev", "qa", "app", "prod"]);
      expect(config.prodEnv).toBe("prod");
      expect(config.prodBranch).toBe("main");
      expect(config.triggerVariables).toEqual(["VITE_APP_TARGET"]);
      expect(config.releaseTagRule.pattern.test(`v3.2.1.0-${appTarget}`)).toBe(
        true,
      );
      expect(
        config.releaseTagRule.pattern.test(`v3.2.1.0-${appTarget}.7`),
      ).toBe(true);
      expect(
        config.releaseTagRule.pattern.test(`v3.2.1.0-${appTarget}-7`),
      ).toBe(false);
      expect(
        config.releaseTagRule.format({
          major: 3,
          minor: 2,
          patch: 1,
          build: 4,
        }),
      ).toBe(`v3.2.1.4-${appTarget}`);
      expect(
        config.formatPrereleaseTag({
          branchPart: "deploy",
          env: "dev",
          nextNumber: 2,
          releaseTag: `v3.2.1.4-${appTarget}`,
        }),
      ).toBe(`v3.2.1.4-${appTarget}-deploy-dev.2`);
      expect(
        config.formatPrereleaseTag({
          branchPart: "",
          env: "qa",
          nextNumber: 3,
          releaseTag: `v3.2.1.4-${appTarget}`,
        }),
      ).toBe(`v3.2.1.4-${appTarget}-qa.3`);
      expect(
        config.formatPrereleaseTag({
          branchPart: "deploy",
          env: "app",
          nextNumber: 1,
          releaseTag: `v3.2.1.4-${appTarget}`,
        }),
      ).toBe(`v3.2.1.4-${appTarget}-deploy-app.1`);
      expect(
        config.formatPrereleaseTag({
          branchPart: "",
          env: "app",
          nextNumber: 0,
          releaseTag: `v3.2.1.4-${appTarget}`,
        }),
      ).toBe(`v3.2.1.4-${appTarget}-app.0`);
    },
  );

  test("does not use PACKAGE_VERSION to format the base release tag", async () => {
    process.env.PACKAGE_VERSION = "99.88.77-internal-test.1";
    const config = await loadReleaseTagConfig("demo");

    expect(
      config.releaseTagRule.format({
        major: 3,
        minor: 2,
        patch: 1,
        build: 5,
      }),
    ).toBe("v3.2.1.5-demo");
  });

  test("rejects missing and unsupported application targets", async () => {
    await expect(loadReleaseTagConfig(undefined)).rejects.toThrow(
      "VITE_APP_TARGET is required",
    );
    await expect(loadReleaseTagConfig("storybook")).rejects.toThrow(
      "VITE_APP_TARGET is required",
    );
  });
});

describe("release package scripts", () => {
  test("uses orderly-release-tag for every environment and application target", async () => {
    const packageJson = JSON.parse(
      await readFile(path.join(projectRoot, "package.json"), "utf8"),
    );

    expect(packageJson.scripts.release).toBeUndefined();

    for (const environment of ["dev", "qa", "app", "prod"]) {
      expect(packageJson.scripts[`release:${environment}`]).toBe(
        `pnpm release:${environment}:demo && pnpm release:${environment}:dmm`,
      );

      for (const appTarget of ["demo", "dmm"]) {
        expect(packageJson.scripts[`release:${environment}:${appTarget}`]).toBe(
          `VITE_APP_TARGET=${appTarget} orderly-release-tag --env ${environment}`,
        );
      }
    }

    expect(packageJson.devDependencies["@orderly.network/release-tag"]).toBe(
      "^1.0.6",
    );
  });
});

async function loadReleaseTagConfig(appTarget) {
  restoreEnvironmentVariable("VITE_APP_TARGET", appTarget);
  vi.resetModules();
  const module = await import("../release-tag.config.mjs");
  return module.default;
}

function restoreEnvironmentVariable(name, value) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}
