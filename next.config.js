const webpack = require('webpack');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withSourceMaps = require('@zeit/next-source-maps')();

require('dotenv').config();

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

    return config;
  },
}));
