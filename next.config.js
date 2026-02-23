/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Reduce compilation time
  experimental: {
    optimizePackageImports: ['@heroicons/react'],
  },
  // Faster builds
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Optimize for faster development builds
      config.optimization = {
        ...config.optimization,
        moduleIds: 'named',
      }
    }
    return config
  },
}

module.exports = nextConfig
