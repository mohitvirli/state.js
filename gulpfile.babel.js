import gulp from 'gulp';
import babel from 'gulp-babel';
import mocha from 'gulp-mocha';
import gutil from 'gulp-util';
import eslint from 'gulp-eslint';
import del from 'del';
import webpack from 'webpack';
import webpackConfig from './webpack.config.babel';

gulp.task('default', ['build']);

gulp.task('lint', () => {
  return gulp.src('./src/*.js')
    .pipe(eslint({
      "root": true,
      "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module"
      },
      "extends": [
        "eslint:recommended"
      ]
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(gulp.dest('src'));
});

gulp.task('babel', ['lint'], () => {
	return gulp.src('src/*.js')
		.pipe(babel())
		.pipe(gulp.dest('target'));
});

gulp.task('clean:dist', function() {
  return del.sync('dist/*');
});

gulp.task('test', ['babel'], () => {
	return gulp.src('test/*.js')
		.pipe(mocha())
		.on('error', () => {
			gulp.emit('end');
		});
});

gulp.task('watch-test', () => {
	return gulp.watch(['src/**', 'test/**'], ['test']);
});

gulp.task('build', ['test', 'clean:dist'], function(callback) {
	const config = Object.create(webpackConfig);
  config.plugins = [
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin(),
	];
  webpack(config, function(err, stats) {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      colors: true,
      progress: true
    }));
    callback();
  });
});
