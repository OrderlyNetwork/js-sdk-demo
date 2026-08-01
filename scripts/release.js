const { $ } = require("zx");
const { notifySafely } = require("./utils/notify");
const { updateDependencies } = require("./utils/updateDependencies");

// Enable verbose logging for shell commands executed via zx
$.verbose = true;

// Current branch in CI environment
const ciBranch = process.env.CI_COMMIT_BRANCH;
const ciPipelineUrl = process.env.CI_PIPELINE_URL;

// Truthy if running in CI environment
const isCI = ciBranch;

const packageVersion = process.env.PACKAGE_VERSION;
const triggerBranch = process.env.TRIGGER_BRANCH;
// Prefer APP_TARGET from orderly-web triggerPipeline; fall back to VITE_APP_TARGET.
// CI yaml defaults VITE_APP_TARGET=demo, so trigger APP_TARGET must win when present.
const appTarget = process.env.APP_TARGET || process.env.VITE_APP_TARGET;

// Git user info for automated commits
const git = {
  username: process.env.GIT_USERNAME,
  token: process.env.GIT_TOKEN,
};

async function main() {
  try {
    validateAppTarget();

    await checkBranch();

    await updateDependencies(packageVersion);

    await installDependencies();

    await commitChanges();

    await createTag();
  } catch (error) {
    const msg = `Pipeline trigger failed: ${error.message}`;
    console.error(msg);
    if (isCI) {
      await notifySafely(msg, {
        link: ciPipelineUrl
          ? { label: "View Pipeline", url: ciPipelineUrl }
          : undefined,
      });
    }
    throw error;
  }
}

async function checkBranch() {
  const targetBranch = isCI ? triggerBranch : await getCurrentBranch();
  if (!targetBranch) {
    throw new Error(
      isCI
        ? "TRIGGER_BRANCH environment variable is required"
        : "Unable to determine the current git branch",
    );
  }

  if (isCI) {
    await $`git config user.name "Gitlab CI"`;
    await $`git config user.email "gitlab-ci@orderly.network"`;
  }

  await $`git checkout ${targetBranch}`;
  await $`git pull origin ${targetBranch}`;
}

async function installDependencies() {
  if (isCI) {
    await $`pnpm install --no-frozen-lockfile`;
  } else {
    await $`pnpm install`;
  }
}

async function commitChanges() {
  const diff = await $`git diff --quiet package.json pnpm-lock.yaml`.nothrow();
  if (diff.exitCode === 0) {
    throw new Error("No changes to commit");
  }

  await $`git add package.json pnpm-lock.yaml`;
  await $`git commit -m "update sdk version to ${packageVersion}"`;
  await pushToRemote();
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

  if (!match) {
    throw new Error(`Invalid version: ${version}`);
  }

  const [, major, minor, patch] = match;
  const newPatch = parseInt(patch, 10) - 1;

  return `${major}.${minor}.${newPatch > 0 ? newPatch : 0}`;
}

function resolveTagVersion(version) {
  if (isStableVersion(version)) {
    return version;
  }

  if (isInternalVersion(version)) {
    return getInternalVersion(version);
  }

  throw new Error(
    `Unsupported PACKAGE_VERSION "${version}". Expected a stable version (x.y.z) or an internal version (*-internal-*).`,
  );
}

async function createTag() {
  const suffix = appTarget;
  const version = resolveTagVersion(packageVersion);

  const latestTag = await getLatestTag(version, suffix);
  console.log("latestTag: ", latestTag);

  const newTag = latestTag
    ? getNextTag(latestTag, suffix)
    : getInitialTag(version, suffix);

  console.log(`Creating new tag: ${newTag}`);

  await $`git tag "${newTag}"`;
  await pushToRemote(newTag);

  console.log(`Successfully created tag: ${newTag}`);
}

function getInitialTag(version, suffix) {
  return `v${version}.0-${suffix}`;
}

function validateAppTarget() {
  if (!["demo", "dmm"].includes(appTarget)) {
    throw new Error(
      `VITE_APP_TARGET or APP_TARGET is required and must be "demo" or "dmm", received: ${appTarget}`,
    );
  }
}

function getNextTag(tag, suffix) {
  // v2.7.4.0-demo
  const regex = new RegExp(`v(\\d+\\.\\d+\\.\\d+)\\.(\\d+)-${suffix}`);
  const match = tag.match(regex);

  if (!match) {
    throw new Error(`Invalid tag: ${tag}`);
  }

  const [, version, sequence] = match;
  return `v${version}.${parseInt(sequence, 10) + 1}-${suffix}`;
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
  return match ? parseInt(match[1], 10) : 0;
}

async function pushToRemote(ref) {
  if (isCI) {
    const remoteUrl = await getRemoteUrl();
    if (ref) {
      await $`git push ${remoteUrl} "${ref}"`;
    } else {
      await $`git push ${remoteUrl}`;
    }
    return;
  }

  if (ref) {
    await $`git push origin "${ref}"`;
  } else {
    await $`git push origin`;
  }
}

/**
 * Construct the remote git repository URL with authentication token.
 * Format: https://<username>:<token>@gitlab.com/<repoPath>.git
 */
async function getRemoteUrl() {
  const missing = [];
  if (!git.username) missing.push("GIT_USERNAME");
  if (!git.token) missing.push("GIT_TOKEN");
  if (missing.length > 0) {
    throw new Error(
      `Missing git credentials for CI push: ${missing.join(", ")}`,
    );
  }

  const repoPath = await getRepoPath();
  if (!repoPath) {
    throw new Error("Unable to resolve git remote repository path from origin");
  }

  return `https://${git.username}:${git.token}@gitlab.com/${repoPath}.git`;
}

/**
 * Extract the repository path (owner/name) from the git remote origin URL.
 * Supports HTTPS and SSH URLs for GitHub and GitLab.
 */
async function getRepoPath() {
  const res = await $`git remote get-url origin`;
  const origin = res.stdout?.replace(/\s+/g, "");
  const regex = /(?:github\.com|gitlab\.com)[:/](.+?\/.+?)\.git/;
  const match = origin.match(regex);
  return match ? match[1] : null;
}

async function getCurrentBranch() {
  const res = await $`git branch --show-current`;
  const currentBranch = res.stdout?.trim();
  console.log("currentBranch: ", currentBranch);
  return currentBranch;
}

main().catch(() => {
  process.exitCode = 1;
});
