const fs = require("fs-extra");
const path = require("path");

/** Packages that should be excluded from version updates */
const EXCLUDED_PACKAGES = [
  "@orderly.network/release-tag",
  "@orderly.network/fast-place-order-plugin",
  "@orderly.network/onramper-plugin",
  "@orderly.network/orderbook-shimmer-plugin",
];

/** Update all @orderly.network/* dependencies to the specified version */
async function updateDependencies(packageVersion) {
  if (!packageVersion) {
    throw new Error("package version is required");
  }
  console.log("target package version: ", packageVersion);

  const packageJsonPath = path.join(process.cwd(), "package.json");
  const packageJson = await fs.readJSON(packageJsonPath);

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
    throw new Error("No dependencies to update");
  }

  await fs.writeFile(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
  );
}

module.exports = {
  updateDependencies,
};
