var path = require('path');
const src = path.resolve('src');
const demo = path.resolve('demo');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  cache: true,
  devtool: 'eval',
  entry: [
    '@babel/polyfill',
    path.join(demo, 'app')
  ],
  output: {
    path: path.resolve('build'),
    pathinfo: true,
    filename: 'static/js/bundle.js',
    publicPath: '/',
  },
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
    extensions: ['.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [src, demo],
        use: [
          {
            loader: 'babel-loader',
            options: require('./babel.dev'), // eslint-disable-line
          },
        ],
      },
      {
        test: /\.css$/,
        include: [src, demo],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[name]--[local]',
              },
            },
          },
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve('index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/react-datasheet.css', to: 'static/css/' },
        { from: 'demo/temp.css', to: 'static/css/' },
      ],
    }),
  ],
  devServer: {
    allowedHosts: 'all',
  }
};
