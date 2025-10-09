const { $ } = require("zx");
const { notifyTelegram } = require("./utils/notifyTelegram");
const { updateDependencies } = require("./utils/updateDependencies");
const fs = require("fs-extra");
const path = require("path");

// Enable verbose logging for shell commands executed via zx
$.verbose = true;

// Current branch in CI environment
const ciBranch = process.env.CI_COMMIT_BRANCH;

// Truthy if running in CI environment
const isCI = ciBranch;

const packageVersion = process.env.PACKAGE_VERSION;
const triggerBranch = process.env.TRIGGER_BRANCH;

// Git user info and commit message for automated commits
const git = {
  /** Git username */
  username: process.env.GIT_USERNAME,
  /** Git authentication token */
  token: process.env.GIT_TOKEN,
};

async function main() {
  try {
    await checkBranch();

    await updateDependencies(packageVersion);

    await installDependencies();

    await commitChanges();

    await createTag();
  } catch (error) {
    const msg = `Pipeline trigger failed: ${error.message}`;
    console.error(msg);
    await notifyTelegram(msg);
    throw error;
  }
}

async function checkBranch() {
  const targetBranch = isCI ? triggerBranch : await getCurrentBranch();
  // Check if target branch exists, create if not
  if (!targetBranch) {
    throw new Error("TRIGGER_BRANCH environment variable is required");
  }

  if (isCI) {
    // config git user when commit
    await $`git config user.name "Gitlab CI"`;
    await $`git config user.email "gitlab-ci@orderly.network"`;
  }

  await $`git checkout ${targetBranch}`;
  await $`git pull origin ${targetBranch}`;

  // Fetch latest changes
  // await $`git fetch origin`;

  // not need to check branch exists
  // console.log(`Checking if branch ${releaseBranch} exists...`);
  // try {
  //     await $`git ls-remote --exit-code --heads origin ${releaseBranch}`;
  //     console.log(`Branch ${releaseBranch} exists, checking out...`);
  //     await $`git checkout ${releaseBranch}`;
  //     await $`git pull origin ${releaseBranch}`;
  // } catch (error) {
  //     console.log(`Branch ${releaseBranch} does not exist, creating from orderly-v2...`);
  //     await $`git checkout -b ${releaseBranch} origin/orderly-v2`;
  // }
}

async function installDependencies() {
  const isInternal = isInternalVersion(packageVersion);
  if (isInternal) {
    await updateInternalNpmrc();
  }
  // install dependencies and update pnpm-lock.yaml
  if (isCI) {
    await $`pnpm install --no-frozen-lockfile`;
  } else {
    await $`pnpm install`;
  }

  if (isInternal) {
    await $`git restore .npmrc`;
  }
}

async function commitChanges() {
  try {
    await $`git diff --quiet package.json pnpm-lock.yaml`;
    throw new Error("No changes to commit");
  } catch (error) {
    await $`git add package.json pnpm-lock.yaml`;
    await $`git commit -m "update sdk version to ${packageVersion}"`;
    if (isCI) {
      const remoteUrl = await getRemoteUrl();
      await $`git push ${remoteUrl}`;
    } else {
      await $`git push origin`;
    }
  }
}

function isStableVersion(version) {
  const regex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
  return regex.test(version);
}

function isInternalVersion(version) {
  return version.includes("-internal-");
}

function getInternalVersion(version) {
  // 2.7.4-internal-20251009.3
  const regex = /^(\d+)\.(\d+)\.(\d+)-(.+)\.\d+$/;
  const match = version.match(regex);

  const major = match[1];
  const minor = match[2];
  const patch = match[3];
  const suffix = match[4];

  if (!major || !minor || !patch || !suffix) {
    throw new Error(`Invalid version: ${version}`);
  }

  const newPatch = parseInt(patch) - 1;

  return `${major}.${minor}.${newPatch > 0 ? newPatch : 0}`;
}

async function updateInternalNpmrc() {
  const npmrcPath = path.join(process.cwd(), ".npmrc");
  const npmrc = await fs.readFile(npmrcPath, "utf8");
  const internalNpmrc = `@orderly.network:registry="http://npm.orderly.network"`;
  if (!npmrc || (npmrc && npmrc.includes(`# ${internalNpmrc}`))) {
    await fs.writeFile(npmrcPath, internalNpmrc);
  }
}

async function createTag() {
  const suffix = triggerBranch;
  let newTag = "";
  let version = "";

  if (isStableVersion(packageVersion)) {
    version = packageVersion;
  } else if (isInternalVersion(packageVersion)) {
    version = getInternalVersion(packageVersion);
  }

  const latestTag = await getLatestTag(version, suffix);
  console.log("latestTag: ", latestTag);

  newTag = latestTag
    ? getNextTag(latestTag, suffix)
    : getInitialTag(version, suffix);

  console.log(`Creating new tag: ${newTag}`);

  await $`git tag "${newTag}"`;
  if (isCI) {
    const remoteUrl = await getRemoteUrl();
    await $`git push ${remoteUrl} "${newTag}"`;
  } else {
    await $`git push origin "${newTag}"`;
  }

  console.log(`Successfully created tag: ${newTag}`);
}

function getInitialTag(version, suffix) {
  return `${version}.0-${suffix}`;
}

function getNextTag(tag, suffix) {
  // v2.7.4.0-demo
  const regex = new RegExp(`v(\\d+\\.\\d+\\.\\d+)\\.(\\d+)-${suffix}`);
  const match = tag.match(regex);

  const version = match[1];
  const sequence = match[2];

  if (!version || !sequence) {
    throw new Error(`Invalid tag: ${tag}`);
  }

  return `${version}.${parseInt(sequence) + 1}-${suffix}`;
}

async function getLatestTag(version, suffix) {
  // v2.7.4.0-demo,v2.7.4.1-demo,v2.7.4.2-demo
  const res =
    await $`git for-each-ref --sort=-creatordate --format='%(refname:short)' refs/tags/v${version}.[0-9]*-${suffix} | head -n 10`;
  const tagList = res?.stdout
    ?.trim()
    .split("\n")
    .filter((tag) => tag);

  tagList.sort((a, b) => {
    const aSeq = getSeqFromTag(a, suffix);
    const bSeq = getSeqFromTag(b, suffix);
    return bSeq - aSeq;
  });

  return tagList?.[0];
}

function getSeqFromTag(tag, suffix) {
  const regex = new RegExp(`v\\d+\\.\\d+\\.\\d+\\.(\\d+)-${suffix}`);
  const match = tag.match(regex);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Construct the remote git repository URL with authentication token if provided.
 * Supports GitLab personal access token authentication format.
 */
async function getRemoteUrl() {
  const repoPath = await getRepoPath();

  if (git.token && git.username && repoPath) {
    // Format: https://<username>:<token>@gitlab.com/<repoPath>.git
    return `https://${git.username}:${git.token}@gitlab.com/${repoPath}.git`;
  }

  return "";
}

/**
 * Extract the repository path (owner/name) from the git remote origin URL.
 * Supports HTTPS and SSH URLs for GitHub and GitLab.
 * Examples:
 * https://github.com/OrderlyNetwork/orderly-sdk-js.git => OrderlyNetwork/orderly-sdk-js
 * git@github.com:OrderlyNetwork/orderly-sdk-js.git => OrderlyNetwork/orderly-sdk-js
 */
async function getRepoPath() {
  const res = await $`git remote get-url origin`;
  // console.log("getRepoPath: ", res);
  const origin = res.stdout?.replace(/\s+/g, "");
  const regex = /(?:github\.com|gitlab\.com)[:/](.+?\/.+?)\.git/;
  const match = origin.match(regex);
  const repoPath = match ? match[1] : null;
  return repoPath;
}

/**
 * Retrieve the current git branch name.
 * Uses CI branch environment variable if available.
 */
async function getCurrentBranch() {
  const res = await $`git branch --show-current`;
  const currentBranch = res.stdout?.trim();
  console.log("currentBranch: ", currentBranch);
  return currentBranch;
}

main();
