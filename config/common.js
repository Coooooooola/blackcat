const path = require('path');

const DEVELOPMENT = 'development';
const PRODUCTION = 'production';

const isProduction = process.env.NODE_ENV === PRODUCTION;
const isDevelopment = process.env.NODE_ENV === DEVELOPMENT;

const root = path.resolve(__dirname, '../');

const src = path.resolve(root, 'src');
const srcMain = path.resolve(src, 'main.tsx');

const public = path.resolve(root, 'public');
const publicHtml = path.resolve(public, 'index.html');

const build = path.resolve(root, 'build');
const buildWeb = path.resolve(build, 'web');

const paths = {
  root,

  src,
  srcMain,

  public,
  publicHtml,

  build,
  buildWeb,
};

const RESOLVE_FALLBACK = {
  // fs: false,
  // tls: false,
  // net: false,
  // path: false,
  // zlib: false,
  // http: false,
  // https: false,
  // stream: false,
  // crypto: false,
  // buffer: false,
  // util: false,
};

module.exports = {
  DEVELOPMENT,
  PRODUCTION,
  isProduction,
  isDevelopment,
  paths,
  RESOLVE_FALLBACK,
};
