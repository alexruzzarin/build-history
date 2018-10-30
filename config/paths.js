const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const moduleFileExtensions = ['mjs', 'js', 'json', 'jsx'];

const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

const paths = {
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  appSrc: resolveApp('src'),
  appHtml: resolveApp('src/index.html'),
  moduleFileExtensions
};

process.env.NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(fs.realpathSync(process.cwd()), folder))
  .join(path.delimiter);

module.exports = paths;
