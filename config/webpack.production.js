const path = require('path');
const { merge } = require('webpack-merge');
const { PRODUCTION } = require('./common.js');
const { webpackConfig } = require('./webpack.base.js');
const yargs = require('yargs');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { DefinePlugin } = require('webpack');

const { analyze } = yargs;

module.exports = merge(webpackConfig, {
  mode: PRODUCTION,
  plugins: [
    analyze && new BundleAnalyzerPlugin(),
    new DefinePlugin({
      __DEV__: false,
    }),
  ].filter(Boolean),
});
