import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

const appFiles = ["src/**/*.{ts,tsx}", "vite.config.ts"];
const withAppFiles = (config) => ({
  ...config,
  files: appFiles,
  settings: {
    ...config.settings,
    react: {
      version: "detect",
      ...config.settings?.react,
    },
  },
});

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "dist/**",
      "build/**",
      "out/**",
      "node_modules/**",
      "public/tradingview/**",
      "coverage/**",
    ],
  },
  withAppFiles(js.configs.recommended),
  ...tseslint.configs.recommended.map(withAppFiles),
  withAppFiles(react.configs.flat.recommended),
  withAppFiles(react.configs.flat["jsx-runtime"]),
  {
    files: appFiles,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^React$",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "react-hooks/set-state-in-effect": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
);
