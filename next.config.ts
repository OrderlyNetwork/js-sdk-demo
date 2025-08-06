import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone",
  output: "export",
  // output: process.env.NODE_ENV === "production" ? "export" : "standalone",
  // https://nextjs.org/docs/app/api-reference/config/next-config-js/trailingSlash
  // when use export, trailingSlash must be true
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  webpack: (config) => {
    // fix Module not found: Can't resolve 'pino-pretty' warning https://github.com/pinojs/pino/issues/688
    config.externals = [...config.externals, "pino-pretty"];
    return config;
  },
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
