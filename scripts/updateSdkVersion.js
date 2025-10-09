const { $ } = require("zx");
const { updateDependencies } = require("./utils/updateDependencies");

// Enable verbose logging for shell commands executed via zx
$.verbose = true;

async function updateSdkVersion() {
  const args = process.argv.slice(2);
  const packageVersion = args[0];
  console.log("packageVersion: ", packageVersion);
  if (!packageVersion) {
    throw new Error("package version is required");
  }
  await updateDependencies(packageVersion);

  await $`pnpm install`;
  await $`git add package.json pnpm-lock.yaml`;
  await $`git commit -m "update sdk version to ${packageVersion}"`;
  await $`git push origin`;
}

updateSdkVersion();
