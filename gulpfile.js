/**
 * Robots-JU FLL 2016 Scoreboard
 * @author Clark Winkelmann <clark.winkelmann@gmail.com>
 * @license MIT
 */

var gulp        = require('gulp');
var concat      = require('gulp-concat');
var sass        = require('gulp-sass');
var uglify      = require('gulp-uglify');
var fileinclude = require('gulp-file-include');

var bower_path = './bower_components/';
var node_path  = './node_modules/';
var src_path   = './src/';

var dest_path        = './site/';
var assets_dest_path = dest_path + 'assets/';

gulp.task('scripts', function() {
	return gulp.src([
			node_path + 'react/dist/react-with-addons.min.js',
			node_path + 'react-dom/dist/react-dom.min.js',
			bower_path + 'fll-robotgame-scorer-2016/src/scorer.js',
			src_path + 'js/*.js'
		])
		.pipe(concat('script.js'))
		.pipe(fileinclude({
			prefix: '@@',
			basepath: src_path + 'data/'
		}))
		.pipe(uglify())
		.pipe(gulp.dest(assets_dest_path));
});

gulp.task('styles', function() {
	return gulp.src([
			src_path + 'scss/*.scss'
		])
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(concat('style.css'))
		.pipe(gulp.dest(assets_dest_path));
});

gulp.task('images', function() {
	return gulp.src([
			src_path + 'img/*.jpg',
			src_path + 'img/*.png'
		])
		.pipe(gulp.dest(assets_dest_path));
});

gulp.task('html', function() {
	return gulp.src([
			src_path + 'html/*.html'
		])
		.pipe(gulp.dest(dest_path));
});

gulp.task('default', ['scripts', 'styles', 'images', 'html']);

gulp.task('watch', ['default'], function() {
	gulp.watch(src_path + '**/*', ['default']);
});
