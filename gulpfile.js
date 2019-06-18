const gulp = require('gulp');
const runSequence = require('run-sequence');
const useref = require('gulp-useref');
const concat = require('gulp-concat');
const inline = require('gulp-inline');
const filter = require('gulp-filter');
const minifyjs = require('gulp-babel-minify');
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace');
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

// Special concat for CodePen.
// Only outputs JS, with generous whitespace at each file boundary.
gulp.task('combine-files-codepen', () => {
	return gulp.src('src/index.html')
		.pipe(useref({ noconcat: true }))
		.pipe(filter('**/*.js'))
		.pipe(concat('combined.js', { newLine: '\r\n'.repeat(5) }))
		.pipe(gulp.dest('build'));
});


// Remove invokation of all `PERF_*` functions.
gulp.task('stripPerfCode', () => {

	// RegExp used to match custom `PERF_*` functions.
	//
	// Matches:
	// - PERF_START('some-name');
	// - PERF_END('some-name')
	// - PERF_UPDATE();
	// - PERF_FOO('@#$%');
	//
	// Doesn't Match:
	// - PERF_START("some-name"); // no double quotes
	// - PERF_START('foo', 'bar'); // no multiple arguments
	// - PERF_start('some-name'); // no lowercase in function name

	const perfFnRegExp = /PERF_[A-Z]+\(('[^']+')?\);?/g;

	return gulp.src('build/combined.js')
		.pipe(replace(perfFnRegExp, ''))
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
		'stripPerfCode',
		'iife',
		'inline-minify',
		finish
	);
});



gulp.task('codepen', callback => {
	const finish = () => {
		console.log(chalk.cyanBright('CODEPEN BUILD COMPLETE'));
		callback();
	}

	runSequence(
		'clean',
		'combine-files-codepen',
		'stripPerfCode',
		finish
	);
});
