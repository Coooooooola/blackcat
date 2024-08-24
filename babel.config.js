const prodEnvOptions = {
  targets: 'ie 6',
  useBuiltIns: 'usage',
  corejs: 3,
};

const devEnvOptions = {
  targets: 'last 1 chrome version',
};

function config(api) {
  api.cache(true);
  const production = process.env.NODE_ENV === 'production';

  const presets = [
    ['@babel/preset-env', production ? prodEnvOptions : devEnvOptions],
    require('@babel/preset-react'),
    require('@babel/preset-typescript'),
  ];

  const plugins = [];

  const ignore = ['node_modules'];

  return { presets, plugins, ignore };
}

module.exports = config;
