const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    vendor: ['vue', 'vue-router']
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name]-[hash].js',
    library: '[name]_[hash]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve('[name]-manifest.json'),
      name: '[name]_[hash]'
    })
  ]
}