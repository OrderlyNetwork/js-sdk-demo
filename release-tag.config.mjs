const appTargets = ["demo", "dmm"];

const getAppTarget = () => {
  const appTarget = process.env.APP_TARGET ?? process.env.VITE_APP_TARGET;

  if (!appTargets.includes(appTarget)) {
    throw new Error(
      `APP_TARGET is required and must be one of: ${appTargets.join(", ")}`,
    );
  }

  return appTarget;
};

const appTarget = getAppTarget();

const releaseTagConfig = {
  environments: ["dev", "qa", "prod"],
  prodEnv: "prod",
  prodBranch: "main",

  releaseTagRule: {
    pattern: new RegExp(`^v(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)-${appTarget}$`),
    description: `vX.Y.Z.W-${appTarget}`,
    example: `v3.0.4.1-${appTarget}`,
    format({ major, minor, patch, build }) {
      return `v${major}.${minor}.${patch}.${build}-${appTarget}`;
    },
  },

  formatPrereleaseTag({ releaseTag, branchPart, nextNumber }) {
    return branchPart
      ? `${releaseTag}-${branchPart}-${nextNumber}`
      : `${releaseTag}-${nextNumber}`;
  },
};

export default releaseTagConfig;
