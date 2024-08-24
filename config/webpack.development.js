const path = require('path');
const { webpackConfig } = require('./webpack.base.js');
const { merge } = require('webpack-merge');
const { DEVELOPMENT } = require('./common.js');
const { DefinePlugin } = require('webpack');

module.exports = merge(webpackConfig, {
  mode: DEVELOPMENT,
  devServer : {
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:4000'
    },
  },
  plugins: [
    new DefinePlugin({
      __DEV__: true,
    }),
  ],
});
