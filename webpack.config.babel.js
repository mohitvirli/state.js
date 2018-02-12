import path from 'path';

module.exports = {
  entry: {
    preload: './target/state.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '../dist/',
    filename: 'state.min.js',
    library: 'State',
    libraryTarget: 'umd'
  }
};