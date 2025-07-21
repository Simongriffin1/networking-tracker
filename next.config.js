/** @type {import('next').NextConfig} */
const nextConfig = {
  // appDir is now the default in Next.js 14
  webpack: (config, { isServer, dev }) => {
    // Fix for module resolution issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    
    // Improve caching and fix vendor chunk issues
    if (!dev) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      }
    }
    
    // Fix vendor chunk resolution issues
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            enforce: true,
          },
        },
      },
    }
    
    return config
  },
  // Disable experimental features that cause issues
  experimental: {
    // Remove any experimental features that might cause build issues
  },
}

module.exports = nextConfig 