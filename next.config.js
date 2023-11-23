/** @type {import('next').NextConfig} */
const nextConfig = {
	distDir: 'dist',
	output: 'standalone',
	// reactStrictMode: true,
	webpack: (config, { isServer }) => {
		if (!isServer) {
			// don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
			config.resolve.fallback = {
				fs: false,
			};
		}
		return config;
	},
	typescript: {
		// Dangerously allow production builds to successfully complete even if your project has type errors.
		ignoreBuildErrors: true,
	},
};

module.exports = nextConfig;
