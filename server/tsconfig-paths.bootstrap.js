const path = require('path');
const tsConfig = require('./tsconfig.json');
const { register } = require('tsconfig-paths');


const { compilerOptions: { outDir, paths } } = tsConfig;
register({
  baseUrl: path.resolve(__dirname, outDir),
  paths,
});
