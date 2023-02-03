const path = require('path')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
    transpilePackages: ['shared-utils', 'shared-atoms'],
    webpack5: true,
    webpack: (config) => {
        config.resolve.fallback = { fs: false }
        return config
    },
    output: 'standalone',
    experimental: {
        outputFileTracingRoot: path.join(__dirname, '../../'),
    },
})
