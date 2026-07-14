const appTargets = ["demo", "dmm"];

const getAppTarget = () => {
  const appTarget = process.env.VITE_APP_TARGET;

  if (!appTargets.includes(appTarget)) {
    throw new Error(
      `VITE_APP_TARGET is required and must be one of: ${appTargets.join(", ")}`,
    );
  }

  return appTarget;
};

const appTarget = getAppTarget();

const releaseTagConfig = {
  environments: ["dev", "qa", "prod"],
  prodEnv: "prod",
  prodBranch: "main",
  triggerVariables: ["VITE_APP_TARGET"],

  releaseTagRule: {
    pattern: new RegExp(
      `^v(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)-${appTarget}(?:-\\d+)?$`,
    ),
    description: `vX.Y.Z.W-${appTarget} or vX.Y.Z.W-${appTarget}-N`,
    example: `v3.2.1.0-${appTarget}`,
    format({ major, minor, patch, build = 0 }) {
      return `v${major}.${minor}.${patch}.${build}-${appTarget}`;
    },
  },

  formatPrereleaseTag({ releaseTag, branchPart, env, nextNumber }) {
    return branchPart
      ? `${releaseTag}-${branchPart}-${env}-${nextNumber}`
      : `${releaseTag}-${env}-${nextNumber}`;
  },
};

export default releaseTagConfig;
