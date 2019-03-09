/**
 * @fileoverview Webpack configuration file for client side scripts.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const path = require('path')

module.exports = {
  entry: './client/js/client.js',
  output: {
    filename: 'client.bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'cheap-eval-source-map',
  mode: 'development'
}
