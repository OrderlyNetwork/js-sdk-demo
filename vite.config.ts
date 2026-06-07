import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

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
  ],
  json: {
    namedExports: true,
    stringify: true,
  },
  server: {
    host: true,
    open: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: process.env.ENABLE_SOURCEMAP === "true",
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
