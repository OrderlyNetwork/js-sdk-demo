const { $ } = require("zx");
const { notifySafely } = require("./utils/notify");
const {
  createSafeHttpsRemoteUrl,
  redactSecrets,
  withGitAskPass,
} = require("./utils/releaseCredentials");
const { updateDependencies } = require("./utils/updateDependencies");

$.verbose = true;

const ALLOWED_RELEASE_FILES = new Set(["package.json", "pnpm-lock.yaml"]);
const VALID_APP_TARGETS = new Set(["demo", "dmm"]);

function getReleaseConfig(env = process.env) {
  const ciBranch = env.CI_COMMIT_BRANCH;

  return {
    appTarget: env.APP_TARGET || env.VITE_APP_TARGET,
    ciBranch,
    ciPipelineUrl: env.CI_PIPELINE_URL,
    git: {
      token: env.GIT_TOKEN,
      username: env.GIT_USERNAME,
    },
    isCI: Boolean(ciBranch),
    packageVersion: env.PACKAGE_VERSION,
    triggerBranch: env.TRIGGER_BRANCH,
  };
}

function validateReleaseConfig(config) {
  if (!config.packageVersion) {
    throw new Error("PACKAGE_VERSION environment variable is required");
  }

  resolveTagVersion(config.packageVersion);
  validateAppTarget(config.appTarget);

  if (!config.isCI) {
    return;
  }

  if (!config.triggerBranch) {
    throw new Error("TRIGGER_BRANCH environment variable is required");
  }

  if (config.triggerBranch !== config.ciBranch) {
    throw new Error(
      `TRIGGER_BRANCH must match CI_COMMIT_BRANCH: ${config.triggerBranch} !== ${config.ciBranch}`,
    );
  }

  const missingCredentials = [];
  if (!config.git.username) missingCredentials.push("GIT_USERNAME");
  if (!config.git.token) missingCredentials.push("GIT_TOKEN");

  if (missingCredentials.length > 0) {
    throw new Error(
      `Missing git credentials for CI release: ${missingCredentials.join(", ")}`,
    );
  }
}

async function main({ env = process.env, notify = notifySafely } = {}) {
  const config = getReleaseConfig(env);

  try {
    validateReleaseConfig(config);
    await release(config);
  } catch (error) {
    const message = redactSecrets(
      `Release failed: ${getErrorMessage(error)}`,
      [config.git.token],
      env,
    );
    console.error(message);

    if (config.isCI) {
      try {
        await notify(message, {
          link: config.ciPipelineUrl
            ? { label: "View Pipeline", url: config.ciPipelineUrl }
            : undefined,
        });
      } catch (notificationError) {
        console.error(
          redactSecrets(
            `Failed to send release notification: ${getErrorMessage(notificationError)}`,
            [config.git.token],
            env,
          ),
        );
      }
    }

    throw error;
  }
}

async function release(
  config,
  {
    command = $,
    createAuthenticatedCommand = (env) => $({ env, verbose: false }),
    updateDependenciesImpl = updateDependencies,
  } = {},
) {
  await checkGitStatus(command);

  const targetBranch = config.isCI
    ? config.triggerBranch
    : await getCurrentBranch(command);
  await validateGitBranch(targetBranch, command);
  const remote = config.isCI ? await getSafeRemoteUrl(command) : "origin";

  if (config.isCI) {
    await configureGitUser(command);
  }

  await withGitAskPass(config.git, async ({ env }) => {
    const remoteCommand = config.isCI
      ? createAuthenticatedCommand(env)
      : command;

    await checkoutAndPull(targetBranch, remote, remoteCommand);
    await updateDependenciesImpl(config.packageVersion);
    await installDependencies(config.isCI, command);
    await assertOnlyReleaseFilesChanged(command);
    await commitChanges(config.packageVersion, command);

    const tagVersion = resolveTagVersion(config.packageVersion);
    const latestTag = await getLatestRemoteTag(
      remote,
      tagVersion,
      config.appTarget,
      remoteCommand,
    );
    const releaseTag = latestTag
      ? getNextTag(latestTag, config.appTarget)
      : getInitialTag(tagVersion, config.appTarget);

    console.log("latestTag: ", latestTag);
    console.log(`Creating new tag: ${releaseTag}`);

    await pushReleaseCommitAndTag({
      command,
      remote,
      remoteCommand,
      releaseTag,
      targetBranch,
    });

    console.log(`Successfully created tag: ${releaseTag}`);
  });
}

async function checkGitStatus(command = $) {
  const status =
    await command`git status --porcelain=v1 --untracked-files=all`.quiet();
  if (!status.stdout.trim()) {
    return;
  }

  throw new Error(
    "There are uncommitted changes; commit or stash them before releasing",
  );
}

async function configureGitUser(command = $) {
  await command`git config user.name ${"Gitlab CI"}`;
  await command`git config user.email ${"gitlab-ci@orderly.network"}`;
}

async function checkoutAndPull(targetBranch, remote, command = $) {
  await command`git checkout ${targetBranch}`;
  await command`git pull --ff-only ${remote} ${targetBranch}`;
}

async function validateGitBranch(targetBranch, command = $) {
  await command`git check-ref-format --branch ${targetBranch}`.quiet();
}

async function installDependencies(isCI, command = $) {
  if (isCI) {
    await command`pnpm install --no-frozen-lockfile`;
    return;
  }

  await command`pnpm install`;
}

async function assertOnlyReleaseFilesChanged(command = $) {
  const status =
    await command`git status --porcelain=v1 --untracked-files=all`.quiet();
  const changedFiles = status.stdout
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map(getPathFromStatusLine);

  if (changedFiles.length === 0) {
    throw new Error("No changes to commit");
  }

  const unexpectedFiles = changedFiles.filter(
    (filePath) => !ALLOWED_RELEASE_FILES.has(filePath),
  );

  if (unexpectedFiles.length > 0) {
    throw new Error(
      `Unexpected files changed during release: ${unexpectedFiles.join(", ")}`,
    );
  }

  const diff =
    await command`git diff --quiet -- package.json pnpm-lock.yaml`.nothrow();
  if (diff.exitCode === 0) {
    throw new Error("No changes to commit");
  }
}

function getPathFromStatusLine(line) {
  const statusPath = line.slice(3);
  const renameSeparator = " -> ";
  const renameIndex = statusPath.lastIndexOf(renameSeparator);
  return renameIndex >= 0
    ? statusPath.slice(renameIndex + renameSeparator.length)
    : statusPath;
}

async function commitChanges(packageVersion, command = $) {
  await command`git diff --check -- package.json pnpm-lock.yaml`;
  await command`git add -- package.json pnpm-lock.yaml`;

  const stagedDiff =
    await command`git diff --cached --quiet -- package.json pnpm-lock.yaml`.nothrow();
  if (stagedDiff.exitCode === 0) {
    throw new Error("No changes to commit");
  }

  await command`git commit -m ${`update sdk version to ${packageVersion}`}`;
}

function isStableVersion(version) {
  return /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version);
}

function isInternalVersion(version) {
  return typeof version === "string" && version.includes("-internal-");
}

function getInternalVersion(version) {
  const match = version.match(
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)-internal-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*\.(0|[1-9]\d*)$/,
  );

  if (!match) {
    throw new Error(`Invalid internal version: ${version}`);
  }

  const [, major, minor, patch] = match;
  const previousPatch = Math.max(0, Number.parseInt(patch, 10) - 1);
  return `${major}.${minor}.${previousPatch}`;
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

function validateAppTarget(appTarget) {
  if (!VALID_APP_TARGETS.has(appTarget)) {
    throw new Error(
      `VITE_APP_TARGET or APP_TARGET is required and must be "demo" or "dmm", received: ${appTarget}`,
    );
  }
}

function getInitialTag(version, suffix) {
  return `v${version}.0-${suffix}`;
}

function getNextTag(tag, suffix) {
  const parsedTag = parseReleaseTag(tag, suffix);
  if (!parsedTag) {
    throw new Error(`Invalid tag: ${tag}`);
  }

  return `v${parsedTag.version}.${parsedTag.sequence + 1}-${suffix}`;
}

function parseReleaseTag(tag, suffix) {
  const escapedSuffix = escapeRegExp(suffix);
  const match = tag.match(
    new RegExp(
      `^v((?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*))\\.(0|[1-9]\\d*)-${escapedSuffix}$`,
    ),
  );

  if (!match) {
    return null;
  }

  return {
    sequence: Number.parseInt(match[2], 10),
    version: match[1],
  };
}

async function getLatestRemoteTag(remote, version, suffix, command = $) {
  const pattern = `refs/tags/v${version}.*-${suffix}`;
  const result =
    await command`git ls-remote --tags --refs ${remote} ${pattern}`.quiet();
  const matchingTags = result.stdout
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.split(/\s+/)[1])
    .filter(Boolean)
    .map((ref) => ref.replace(/^refs\/tags\//, ""))
    .map((tag) => ({ parsed: parseReleaseTag(tag, suffix), tag }))
    .filter(({ parsed }) => parsed?.version === version)
    .sort((left, right) => right.parsed.sequence - left.parsed.sequence);

  return matchingTags[0]?.tag;
}

async function pushReleaseCommitAndTag({
  command = $,
  remote,
  remoteCommand = command,
  releaseTag,
  targetBranch,
}) {
  await command`git tag ${releaseTag}`;

  const branchRef = `HEAD:refs/heads/${targetBranch}`;
  const tagRef = `refs/tags/${releaseTag}:refs/tags/${releaseTag}`;

  try {
    await remoteCommand`git push --atomic --no-verify ${remote} ${branchRef} ${tagRef}`;
  } catch (error) {
    const cleanup = await command`git tag --delete ${releaseTag}`
      .quiet()
      .nothrow();
    if (cleanup.exitCode !== 0) {
      console.error(`Failed to remove local release tag: ${releaseTag}`);
    }
    throw error;
  }
}

async function getSafeRemoteUrl(command = $) {
  const result = await command`git remote get-url origin`.quiet();
  const origin = result.stdout.trim();
  if (!origin) {
    throw new Error("Unable to resolve git remote URL from origin");
  }

  return createSafeHttpsRemoteUrl(origin);
}

async function getCurrentBranch(command = $) {
  const result = await command`git branch --show-current`.quiet();
  const currentBranch = result.stdout.trim();
  if (!currentBranch) {
    throw new Error(
      "Unable to determine the current git branch; check out a branch before releasing",
    );
  }

  console.log("currentBranch: ", currentBranch);
  return currentBranch;
}

function getErrorMessage(error) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (error && typeof error.stderr === "string" && error.stderr.trim()) {
    return error.stderr.trim();
  }

  return String(error);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

if (require.main === module) {
  main().catch(() => {
    process.exitCode = 1;
  });
}

module.exports = {
  assertOnlyReleaseFilesChanged,
  checkGitStatus,
  getInitialTag,
  getInternalVersion,
  getLatestRemoteTag,
  getNextTag,
  getReleaseConfig,
  isInternalVersion,
  isStableVersion,
  main,
  parseReleaseTag,
  pushReleaseCommitAndTag,
  release,
  resolveTagVersion,
  validateAppTarget,
  validateReleaseConfig,
};
