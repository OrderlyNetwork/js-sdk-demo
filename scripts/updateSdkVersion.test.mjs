import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test } from "vitest";

const script = path.join(import.meta.dirname, "updateSdkVersion.js");
const temporaryRoots = [];

afterEach(async () => {
  await Promise.all(
    temporaryRoots
      .splice(0)
      .map((root) => rm(root, { recursive: true, force: true })),
  );
});

async function createFixture() {
  const root = await mkdtemp(path.join(tmpdir(), "sdk-version-test-"));
  temporaryRoots.push(root);
  const manifest = {
    dependencies: {
      "@orderly.network/prediction": "3.3.0",
      "@orderly.network/ui-notification": "3.3.0",
      "@orderly.network/fast-place-order-plugin": "^0.2.4",
      react: "^18.3.1",
    },
    devDependencies: {
      "@orderly.network/release-tag": "^1.0.6",
      zx: "8.8.5",
    },
  };
  await writeFile(path.join(root, "package.json"), JSON.stringify(manifest));
  return { root, manifest };
}

describe("SDK version updater", () => {
  test("exports the updater without running the CLI or modifying package.json", async () => {
    const { root, manifest } = await createFixture();
    const result = execFileSync(
      process.execPath,
      [
        "-e",
        "const { updateDependencies } = require(process.argv[1]); if (typeof updateDependencies !== 'function') process.exit(1);",
        script,
      ],
      {
        cwd: root,
        env: { ...process.env, PACKAGE_VERSION: "" },
        encoding: "utf8",
      },
    );

    expect(result).toBe("");
    expect(
      JSON.parse(await readFile(path.join(root, "package.json"), "utf8")),
    ).toEqual(manifest);
  });

  test("still updates SDK dependencies through the CLI and keeps independent packages", async () => {
    const { root, manifest } = await createFixture();
    const version = "3.3.1-internal-announcement.1";

    execFileSync(process.execPath, [script, version], { cwd: root });

    expect(
      JSON.parse(await readFile(path.join(root, "package.json"), "utf8")),
    ).toEqual({
      ...manifest,
      dependencies: {
        ...manifest.dependencies,
        "@orderly.network/prediction": version,
        "@orderly.network/ui-notification": version,
      },
    });
  });
});
