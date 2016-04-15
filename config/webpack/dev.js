var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  output : {
    filename : 'bundle.js'
  },
  devtool: 'source-map',
  watch  : true,
  module : {
    loaders : [{
      test   : /\.s?css$/,
      loaders: ['style-loader', 'css-loader', 'sass-loader']
    }, {
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff'
    }, {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff'
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader'
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
    }, {
      test: /\.html$/,
      loader: 'ng-cache-loader'
    }, {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    }]
  },
  plugins : [
    new HtmlWebpackPlugin({
      template : path.join(path.resolve(), 'client/index.ejs'),
      inject: 'body',
      hash: true
    })
  ]
};