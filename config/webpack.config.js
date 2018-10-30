const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const paths = require('./paths');

module.exports = {
  mode: 'production',
  bail: true,
  devtool: 'source-map',
  entry: [paths.appIndexJs],
  output: {
    path: paths.appBuild,
    publicPath: '/',
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    devtoolModuleFilenameTemplate: info =>
      path
        .relative(paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, '/')
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
      template: paths.appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
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
              presets: [require.resolve('@babel/preset-env'), require.resolve('@babel/preset-react')]
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
            presets: [require.resolve('@babel/preset-env')],
            cacheDirectory: true,
            cacheCompression: true,
            sourceMaps: false
          }
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          loader: [
            {
              loader: MiniCssExtractPlugin.loader,
              // options: Object.assign(
              //   {},
              //   shouldUseRelativeAssetPaths ? { publicPath: '../../' } : undefined
              // )
            },
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                sourceMap: true,
              }
            }
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
