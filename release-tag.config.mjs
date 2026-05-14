export default {
  environments: ["dev", "qa", "prod"],
  prodEnv: "prod",
  prodBranch: "demo",

  releaseTagRule: {
    pattern: /^v(\d+)\.(\d+)\.(\d+)\.(\d+)-demo$/,
    description: "vX.Y.Z.W-demo",
    example: "v3.0.4.1-demo",
    format({ major, minor, patch, build }) {
      return `v${major}.${minor}.${patch}.${build}-demo`;
    },
  },

  formatPrereleaseTag({ releaseTag, branchPart, nextNumber }) {
    return branchPart
      ? `${releaseTag}-${branchPart}-${nextNumber}`
      : `${releaseTag}-${nextNumber}`;
  },
};
