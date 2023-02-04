const path = require('path')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
    reactStrictMode: true,
    transpilePackages: [
        'shared-utils',
        'shared-atoms',
        'shared-hooks',
        'shared-components',
    ],
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
