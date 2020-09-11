const path = require('path');

module.exports = {
  entry: {
    table: './src/table.js',
    test: './src/test.js',
  },
  externals : ['d3'],
  mode: 'development',
   // devtool: 'inline-source-map',
   devServer: {
    contentBase: path.join(__dirname, 'dist')
  },
  devtool:'inline-source-map'
};