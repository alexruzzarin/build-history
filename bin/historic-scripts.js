#!/usr/bin/env node

const yargs = require('yargs');
const webpack = require('webpack');

yargs
  .usage('$0 <cmd> [args]')
  .command('build', 'fucking build your app', {}, () => {

    const configProd = require('../config/webpack.config');

    const compiler = webpack(configProd);

    compiler.run((err, stats) => {
      if (err) {
        console.error(err);
      } else {
        console.info(stats.toJson({ all: false, warnings: true, errors: true }));
      }
    });
  })
  .command('start', 'start a dedug server for your app', {}, () => {

    const configDev = require('../config/webpack.config.dev');

    const compiler = webpack(configDev);

    const WebpackDevServer = require('webpack-dev-server');

    const devServer = new WebpackDevServer(compiler, {
      hot: true,
      publicPath: '/'
    });

    devServer.listen(8081, '0.0.0.0', err => {
      if (err) {
        return console.log(err);
      }
      console.log('Starting the development server...\n');
    });

    ['SIGINT', 'SIGTERM'].forEach(function(sig) {
      process.on(sig, function() {
        devServer.close();
        process.exit();
      });
    });
  })
  .help()
  .argv
