const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
const { paths, RESOLVE_FALLBACK, isProduction } = require('./common.js');

const webpackConfig = {
  entry: {
    main: paths.srcMain,
  },
  output: {
    filename: '[name][fullhash:8].js',
    path: paths.buildWeb,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(j|t)sx?$/,
            exclude: /\bnode_modules\b/,
            use: [{
              loader: 'babel-loader',
            }],
          },
          {
            test: /\.scss$/,
            exclude: /\.g\.scss$/,
            use: [
              MiniCssExtractPlugin.loader,
              '@teamsupercell/typings-for-css-modules-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: '[local]_[name]__[hash:4]',
                  },
                },
              },
              'sass-loader',
            ],
          },
          {
            test: /\.g\.scss$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              'sass-loader',
            ],
          },
          {
            test: /\.svg$/,
            use: ['@svgr/webpack'],
          },
          {
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            use: [
              {
                loader: 'file-loader',
              },
            ],
          },
        ],
      },
    ],
  },
  cache: {
    type: 'filesystem',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  resolve: {
    modules: [path.resolve(process.cwd(), 'node_modules')],
    extensions: [".tsx", ".ts", ".js"],
    fallback: RESOLVE_FALLBACK,
    alias: {
      '@src': paths.src,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: paths.publicHtml,
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new EslintWebpackPlugin({
      extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
      eslintPath: require.resolve('eslint'),
      failOnError: isProduction,
    }),
  ],
};

module.exports = {
  webpackConfig,
};
