const { $ } = require('zx');
const { notifyTelegram } = require('./utils/notifyTelegram');
const { updateDependencies } = require('./utils/updateDependencies');

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
        throw new Error('TRIGGER_BRANCH environment variable is required');
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
    // install dependencies and update pnpm-lock.yaml
    if (isCI) {
        await $`pnpm install --no-frozen-lockfile`;
    } else {
        await $`pnpm install`;
    }
}

async function commitChanges() {
    try {
        await $`git diff --quiet package.json pnpm-lock.yaml`;
        throw new Error('No changes to commit');
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

async function createTag() {
    const branchSuffix = triggerBranch.replace(/^internal\//, '').replace(/^release\//, '');

    console.log('branchSuffix: ', branchSuffix);

    const latestTag = await getLatestTag(branchSuffix);

    const newTag = latestTag ? await getNextTag(latestTag, branchSuffix) : await getInitialTag(branchSuffix);

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

async function getInitialTag(branchSuffix) {
    const latestOfficialTag = await getLatestOfficalTag();
    return `${latestOfficialTag}-${branchSuffix}-0`;
}

function getNextTag(tag, branchSuffix) {
    // /^v(\d+\.\d+\.\d+\.\d+)-trigger-pipeline-(\d+)$/
    const regex = new RegExp(`^(v\\d+\\.\\d+\\.\\d+\\.\\d+)-${branchSuffix}-(\\d+)$`);
    const match = tag.match(regex);

    const version = match[1];
    const sequence = parseInt(match[2]);

    if (!version || !sequence) {
        throw new Error(`Invalid tag: ${tag}`);
    }

    return `${version}-${branchSuffix}-${sequence + 1}`;
}

async function getLatestTag(branchSuffix) {
    // v2.7.0.7-trigger-pipeline-1,v2.7.0.7-trigger-pipeline-2,v2.7.0.7-trigger-pipeline-3
    const res = await $`git for-each-ref --sort=-creatordate --format='%(refname:short)' refs/tags/*-${branchSuffix}-* | head -n 10`;
    const tagList = res?.stdout
        ?.trim()
        .split('\n')
        .filter((tag) => tag);

    tagList.sort((a, b) => {
        const aSeq = getSeqFromTag(a, branchSuffix);
        const bSeq = getSeqFromTag(b, branchSuffix);
        return bSeq - aSeq;
    });

    return tagList?.[0];
}

async function getLatestOfficalTag() {
    // v2.7.0.7, v2.7.0.6, v2.7.0.5
    const res =
        await $`git for-each-ref --sort=-creatordate --format='%(refname:short)' refs/tags | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$' | head -n 10`;
    return getFirstTag(res?.stdout);
}
function getFirstTag(tags) {
    const tagList = tags
        ?.trim()
        .split('\n')
        .filter((tag) => tag);

    return tagList?.[0];
}

function getSeqFromTag(tag, branchSuffix) {
    const regex = new RegExp(`-${branchSuffix}-(\\d+)$`);
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

    return '';
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
    const origin = res.stdout?.replace(/\s+/g, '');
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
    console.log('currentBranch: ', currentBranch);
    return currentBranch;
}

main();
