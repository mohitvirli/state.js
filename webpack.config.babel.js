import path from 'path';

module.exports = {
  entry: './target/state.js',
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '../dist/',
    filename: 'State.min.js',
    library: 'State',
    libraryTarget: 'umd'
  }
};