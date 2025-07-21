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
    } else {
      // Disable caching in development to avoid vendor chunk issues
      config.cache = false
    }
    
    // Fix vendor chunk resolution issues
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            enforce: true,
            priority: 10,
            reuseExistingChunk: true,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
            priority: 5,
            reuseExistingChunk: true,
          },
          // Specific vendor chunks for problematic modules
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix',
            chunks: 'all',
            enforce: true,
            priority: 15,
          },
          lucide: {
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            name: 'lucide',
            chunks: 'all',
            enforce: true,
            priority: 15,
          },
        },
      },
    }
    
    // Improve module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './'),
    }
    
    // Fix for vendor chunk resolution in development
    if (dev) {
      config.resolve.symlinks = false
      config.resolve.cacheWithContext = false
    }
    
    return config
  },
  // Disable experimental features that cause issues
  experimental: {
    // Remove any experimental features that might cause build issues
  },
}

module.exports = nextConfig 