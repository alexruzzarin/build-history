const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const paths = require('./paths');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: [
    require.resolve('webpack-dev-server/client') + '?/',
    require.resolve('webpack/hot/dev-server'),
    paths.appIndexJs
  ],
  output: {
    pathinfo: true,
    filename: 'static/js/bundle.js',
    publicPath: '/',
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    modules: ['node_modules'].concat(
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    extensions: paths.moduleFileExtensions.map(ext => `.${ext}`)
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml
    }),
    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin()
  ],
  module: {
    rules: [{
      oneOf: [
        {
          test: /\.(js|mjs|jsx)$/,
          include: paths.appSrc,
          use: [{
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              configFile: false,
              presets: [
                [
                  require.resolve('@babel/preset-env'),
                  {
                    useBuiltIns: false,
                    modules: false
                  }
                ],
                [
                  require.resolve('@babel/preset-react'),
                  {
                    development: true,
                    useBuiltIns: true,
                  }
                ]
              ]
            }
          }]
        },
        {
          test: /\.(js|mjs)$/,
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          loader: require.resolve('babel-loader'),
          options: {
            babelrc: false,
            configFile: false,
            compact: false,
            presets: [
              [
                require.resolve('@babel/preset-env'),
                {
                  useBuiltIns: false,
                  modules: false
                }
              ]
            ],
            cacheDirectory: true,
            cacheCompression: true,
            sourceMaps: false
          }
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          loader: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                sourceMap: true,
              }
            }
          ],
          sideEffects: true
        },
        {
          test: /\.less$/,
          exclude: /\.module\.less$/,
          loader: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                sourceMap: true,
              }
            },
            require.resolve('less-loader')
          ],
          sideEffects: true
        }
      ]
    },
    {
      test: /\.vue$/,
      loader: require.resolve('vue-loader')
    }]
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  }
};
