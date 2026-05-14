export default {
  environments: ["dev", "qa", "prod"],
  prodEnv: "prod",
  prodBranch: "dmm",

  releaseTagRule: {
    pattern: /^v(\d+)\.(\d+)\.(\d+)\.(\d+)-dmm$/,
    description: "vX.Y.Z.W-dmm",
    example: "v3.0.4.1-dmm",
    format({ major, minor, patch, build }) {
      return `v${major}.${minor}.${patch}.${build}-dmm`;
    },
  },

  formatPrereleaseTag({ releaseTag, branchPart, nextNumber }) {
    return branchPart
      ? `${releaseTag}-${branchPart}-${nextNumber}`
      : `${releaseTag}-${nextNumber}`;
  },
};
