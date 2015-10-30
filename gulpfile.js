/**
 * Javascript Task Runner
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

var gulp = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var closureCompiler = require('gulp-closure-compiler');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');

gulp.task('default', ['js', 'less']);

gulp.task('js', function() {
  return gulp.src(['./shared/*.js',
                   './static/js/game/*.js',
                   './static/js/*.js'])
    .pipe(closureCompiler({
      compilerPath: 'bower_components/closure-compiler/compiler.jar',
      fileName: 'minified.js'
    }))
    .pipe(gulp.dest('./static/dist'));
});

gulp.task('less', function() {
  return gulp.src('./static/less/styles.less')
    .pipe(less({ compress: true}))
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(rename(function(path) {
      path.basename = 'minified';
      path.extname = '.css';
    }))
    .pipe(gulp.dest('./static/dist'));
});

gulp.task('watch-js', function() {
  gulp.watch(['./shared/*.js',
              './static/js/*.js',
              './static/js/game/*.js'], ['js']);
});

gulp.task('watch-less', function() {
  gulp.watch('./static/less/*.less', ['less']);
});

gulp.task('watch', function() {
  gulp.watch(['./shared/*.js',
              './static/js/*.js',
              './static/js/game/*.js'], ['js']);
  gulp.watch('./static/less/*.less', ['less']);
});
