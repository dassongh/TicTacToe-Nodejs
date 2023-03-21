const path = require('path');
require('dotenv').config();
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    app: './src/frontend/index.js',
    login: './src/frontend/login.js',
    register: './src/frontend/register.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/frontend/index.html',
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      template: './src/frontend/login.html',
      filename: 'login.html',
      chunks: ['login'],
    }),
    new HtmlWebpackPlugin({
      template: './src/frontend/register.html',
      filename: 'register.html',
      chunks: ['register'],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};
