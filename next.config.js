const webpack = require('webpack');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withSourceMaps = require('@zeit/next-source-maps')();
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

require('dotenv').config();

const { SENTRY_DSN, SENTRY_ORG, SENTRY_PROJECT } = process.env;

module.exports = withSourceMaps(withBundleAnalyzer({
  webpack: (config, options) => {
    // Handle local .env file
    const env = Object.keys(process.env).reduce((acc, curr) => {
      acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
      return acc;
    }, {});

    config.plugins.push(new webpack.DefinePlugin(env));

    // Setup Sentry
    // Resolve appropriate Sentry package depending on server/client
    if (!options.isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser';
    }

    if (SENTRY_DSN && SENTRY_ORG && SENTRY_PROJECT) {
      config.plugins.push(
        new SentryWebpackPlugin({
          version: process.env.RELEASE_VERSION,
          include: '.next',
          ignore: ['node_modules'],
          urlPrefix: '~/_next',
        })
      )
    }

    return config;
  },
}));
