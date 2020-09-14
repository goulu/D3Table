const path = require('path');

module.exports = {
  entry:  './src/table.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'table.js',
    library: 'd3table',
  },
  externals : ['d3'],
  mode: 'development',
   // devtool: 'inline-source-map',
   devServer: {
    contentBase: path.join(__dirname, 'dist')
  },
  devtool:'inline-source-map'
};