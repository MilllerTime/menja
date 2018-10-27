const gulp = require('gulp');
const runSequence = require('run-sequence');
const useref = require('gulp-useref');
const inline = require('gulp-inline');
const minifyjs = require('gulp-babel-minify');
const htmlmin = require('gulp-htmlmin');
const iife = require('gulp-iife');
const del = require('del');
const chalk = require('chalk');
const gzipSize = require('gzip-size');



gulp.task('clean', () => del.sync('build'));

// Concat CSS/JS files linked from index.html, and rewrite references.
gulp.task('combine-files', () => {
	return gulp.src('src/index.html')
		.pipe(useref())
		.pipe(gulp.dest('build'));
});

// Wrap all JS in an IIFE so global variables can be mangled.
gulp.task('iife', () => {
	return gulp.src('build/combined.js')
		.pipe(iife({
			useStrict: true,
			trimCode: true,
			prependSemicolon: false,
			bindThis: false
		}))
		.pipe(gulp.dest('build'));
});

// Minify all code, and inline CSS/JS into HTML file.
gulp.task('inline-minify', () => {
	const htmlminOptions = {
		collapseWhitespace: true,
		removeComments: true,
		minifyCSS: true,
	};

	return gulp.src('build/index.html')
		.pipe(inline({
			base: 'build',
			js: minifyjs
		}))
		.pipe(htmlmin(htmlminOptions))
		.pipe(gulp.dest('build'));
});



gulp.task('default', callback => {
	const finish = () => {
		// Concatenated JS and CSS files can be deleted, they've been inlined.
		del.sync('build/combined.js');
		del.sync('build/combined.css');
		const sizeBytes = gzipSize.fileSync('build/index.html');
		console.log(chalk.cyanBright('BUILD COMPLETE'));
		console.log(chalk.cyanBright('GZIPPED SIZE: ' + chalk.bold(`${(sizeBytes / 1024).toFixed(2)} KB`)));
		callback();
	}

	runSequence(
		'clean',
		'combine-files',
		'iife',
		'inline-minify',
		finish
	);
});
