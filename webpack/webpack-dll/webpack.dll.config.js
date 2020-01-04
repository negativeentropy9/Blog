const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    vendor: ['vue', 'vue-router']
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    library: '[name]'
  },
  plugins: [
  new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      path: path.resolve('./dll/[name]-manifest.json'),
      name: '[name]'
    })
  ]
}