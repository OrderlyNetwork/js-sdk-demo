import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN?.trim();
const sentryOrg = process.env.SENTRY_ORG?.trim();
const sentryProject = process.env.SENTRY_PROJECT?.trim();
const sentryRelease = process.env.SENTRY_RELEASE?.trim();
const enableSentrySourceMaps = Boolean(
  process.env.ENABLE_SOURCEMAP === "true" &&
  sentryAuthToken &&
  sentryOrg &&
  sentryProject,
);

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ["path", "stream", "util", "assert", "crypto"],
      exclude: ["http"],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      overrides: {
        fs: "memfs",
      },
      protocolImports: true,
    }),
    ...(enableSentrySourceMaps
      ? [
          sentryVitePlugin({
            authToken: sentryAuthToken,
            org: sentryOrg,
            project: sentryProject,
            release: sentryRelease ? { name: sentryRelease } : undefined,
            sourcemaps: {
              assets: "./dist/assets/**",
              filesToDeleteAfterUpload: ["./dist/assets/**/*.map"],
            },
          }),
        ]
      : []),
  ],
  json: {
    namedExports: true,
    stringify: true,
  },
  server: {
    host: true,
    open: true,
  },
  envDir: "./env",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: enableSentrySourceMaps ? "hidden" : false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        sourcemapIgnoreList: (sourcePath) => {
          if (sourcePath.includes("node_modules")) {
            return !sourcePath.includes("@orderly.network/");
          }
          return false;
        },
      },
    },
  },
  esbuild: {
    pure: ["console.log", "console.debug"],
    drop: ["debugger"],
  },
});
