const path = require('path');

module.exports = [
  'source-map'
].map(devtool => ({
  mode: 'development',
  entry: './table.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'table.js'
  },
  externals: ['d3'],
  devtool
}));