/** @type {import('next').NextConfig} */
const nextConfig = {
  // appDir is now the default in Next.js 14
  webpack: (config, { isServer }) => {
    // Fix for module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    
    // Improve caching
    config.cache = {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    }
    
    return config
  },
}

module.exports = nextConfig 