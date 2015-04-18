var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del');
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var sourcemaps = require('gulp-sourcemaps');

gulp.task('clean', function (cb) {
	del(['build/**/*'], cb);
});

gulp.task('build', function() {
	gulp.src('src/core/KeyActionBinder.ts')
		.pipe(sourcemaps.init())
		.pipe(ts({
			declarationFiles: true,
			noExternalResolve: false,
			removeComments: false,
			target: "es5",
			module: "amd",
			noImplicitAny: false,
			out: "key-action-binder.js",
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('build'));
});

gulp.task('minify', function () {
	gulp.src('build/key-action-binder.js')
		.pipe(uglify())
		.pipe(concat('key-action-binder.min.js'))
		.pipe(gulp.dest('build'));
});

gulp.task('rebuild', ['clean', 'build', 'minify']);

gulp.task('watch', ['rebuild'], function () {
	gulp.watch(['src/core/KeyActionBinder.ts'], ['rebuild']);
});

gulp.task('default', ['watch']);
