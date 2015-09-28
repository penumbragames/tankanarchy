/**
 * Javascript Task Runner
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

var gulp = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var closureCompiler = require('gulp-closure-compiler');
var less = require('gulp-less');
var merge = require('gulp-merge');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');

gulp.task('default', ['js', 'less']);

gulp.task('js', function() {
  var gameJs = gulp.src('./static/js/game/*.js')
    .pipe(closureCompiler({
      compilerPath: 'bower_components/closure-compiler/compiler.jar',
      fileName: 'game-minified.js'
    }))
    .pipe(gulp.dest('./static/dist'));

  var clientJs = gulp.src('./static/js/*.js')
    .pipe(closureCompiler({
      compilerPath: 'bower_components/closure-compiler/compiler.jar',
      fileName: 'client-minified.js'
    }))
    .pipe(gulp.dest('./static/dist'));

  return merge(gameJs, clientJs);
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
  gulp.watch(['./static/js/*.js', './static/js/game/*.js'], ['js']);
});

gulp.task('watch-less', function() {
  gulp.watch('./static/less/*.less', ['less']);
});

gulp.task('watch', function() {
  gulp.watch(['./static/js/*.js', './static/js/game/*.js'], ['js']);
  gulp.watch('./static/less/*.less', ['less']);
});
