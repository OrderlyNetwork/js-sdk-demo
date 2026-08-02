const fs = require("fs");
const path = require("path");
const { execFileSync } = require("node:child_process");

/** Packages that should be excluded from version updates */
const EXCLUDED_PACKAGES = [
  "@orderly.network/release-tag",
  "@orderly.network/fast-place-order-plugin",
  "@orderly.network/onramper-plugin",
  "@orderly.network/orderbook-shimmer-plugin",
];

const ALLOW_NO_DEP_UPDATE =
  process.env.ALLOW_NO_DEP_UPDATE != null &&
  process.env.ALLOW_NO_DEP_UPDATE !== ""
    ? process.env.ALLOW_NO_DEP_UPDATE === "true"
    : true;

function run(file, args = []) {
  console.log([file, ...args].join(" "));
  execFileSync(file, args, { stdio: "inherit" });
}

/** Update all @orderly.network/* dependencies to the specified version */
function updateDependencies(packageVersion) {
  if (!packageVersion) {
    throw new Error("package version is required");
  }
  console.log("target package version: ", packageVersion);

  const packageJsonPath = path.join(process.cwd(), "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  let isUpdated = false;

  for (const key of Object.keys(allDeps)) {
    if (
      key.startsWith("@orderly.network/") &&
      !EXCLUDED_PACKAGES.includes(key)
    ) {
      if (
        packageJson.dependencies &&
        packageJson.dependencies[key] &&
        packageJson.dependencies[key] !== packageVersion
      ) {
        packageJson.dependencies[key] = packageVersion;
        isUpdated = true;
      }
      if (
        packageJson.devDependencies &&
        packageJson.devDependencies[key] &&
        packageJson.devDependencies[key] !== packageVersion
      ) {
        packageJson.devDependencies[key] = packageVersion;
        isUpdated = true;
      }
    }
  }

  if (!isUpdated) {
    if (!ALLOW_NO_DEP_UPDATE) {
      throw new Error("No dependencies to update");
    }
    console.log("No dependencies to update, skipping");
    return;
  }

  fs.writeFileSync(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
  );
}

/** Install dependencies, then commit and push package.json + lockfile updates */
function installAndCommit(packageVersion) {
  if (!packageVersion) {
    throw new Error("package version is required");
  }

  run("pnpm", ["install"]);
  run("git", ["add", "package.json", "pnpm-lock.yaml"]);
  run("git", ["commit", "-m", `update sdk version to ${packageVersion}`]);
  run("git", ["push", "origin"]);
}

function updateSdkVersion() {
  const args = process.argv.slice(2);
  const packageVersion = args[0];
  console.log("packageVersion: ", packageVersion);
  if (!packageVersion) {
    throw new Error("package version is required");
  }
  updateDependencies(packageVersion);
  // installAndCommit(packageVersion);
}

updateSdkVersion();
