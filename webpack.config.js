var path = require('path');
const src = path.resolve('src');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  cache: true,
  devtool: 'eval',
  entry: ['babel-polyfill', path.join(src, 'app')],
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
        include: src,
        use: [
          {
            loader: 'babel-loader',
            query: require('./babel.dev'), // eslint-disable-line
          },
        ],
      },
      {
        test: /\.css$/,
        include: [src],
        loader: 'style-loader!css-loader?modules&importLoaders&localIdentName=[name]--[local]',
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve('index.html'),
    }),
  ],
  devServer: {
    disableHostCheck: true,
  }
};