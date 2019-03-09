/**
 * @fileoverview Webpack configuration file for client side scripts.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: './client/js/client.js',
  output: {
    filename: 'client.bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.less/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          'css-loader',
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
      chunkFilename: '[id].css'
    })
  ],
  devtool: 'cheap-eval-source-map',
  mode: 'development'
}
