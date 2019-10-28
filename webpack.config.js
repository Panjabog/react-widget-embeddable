const MiniCssEXtractPlugin = require('mini-css-extract-plugin')
const increaseSpecificity = require('postcss-increase-specificity')
const JavaScriptObfuscator = require('webpack-obfuscator')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
// const webpack = require('webpack')

const devMode = process.env.NODE_ENV !== 'production'

const publicDir = path.join(__dirname, 'public')
const distDir = path.join(__dirname, 'dist')

const defaultConfig = {
  mode: process.env.NODE_ENV || 'development',
  devServer: {
    contentBase: publicDir,
    port: 9001
  },
  plugins: [
    new MiniCssEXtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
    }),
    new CopyPlugin([{ from: 'public', to: '.' }]),
    devMode ? null : new JavaScriptObfuscator()
  ].filter(i => i),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitWarning: true
        }
      },
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          'css-loader',
          'cssimportant-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                increaseSpecificity({
                  stackableRoot: '.cleanslate',
                  repeat: 1
                })
              ],
              sourceMap: devMode
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  }
}

module.exports = [
  {
    ...defaultConfig,
    entry: './src/outputs/embeddable-widget.js',
    output: {
      path: distDir,
      publicPath: '/',
      filename: 'widget.js',
      library: 'EmbeddableWidget',
      libraryExport: 'default',
      libraryTarget: 'window'
    }
  },
  {
    ...defaultConfig,
    entry: './src/outputs/bookmarklet.js',
    output: {
      path: distDir,
      publicPath: '/',
      filename: 'bookmarklet.js'
    }
  }
]
