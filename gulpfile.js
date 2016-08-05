/**
 * Multipurpose Javascript Task Runner
 * This compiles LESS and JS assets.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 * @version 1.0.0
 */

var path = require('path');

var gulp = require('gulp');

var del = require('del');
var compilerPackage = require('google-closure-compiler');
var gjslint = require('gulp-gjslint');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var lessPluginAutoprefix = require('less-plugin-autoprefix');
var lessPluginCleanCss = require('less-plugin-clean-css');
var merge = require('merge-stream');

const JS_DIRECTORY = './public/js';
const JS_BUILD_RULES = [
  {
    name: 'game javascript',
    sourceFiles: [
      './public/js/game/*.js',
      './shared/*.js',
      './public/js/requestAnimFrame.js',
      './public/js/client.js'
    ],
    outputFile: 'minified.js'
  }
];
const LESS_BUILD_RULES = [
  {
    name: 'styles',
    sourceFiles: [ './public/less/*.less' ],
    outputFile: 'minified.css'
  }
]
const OUTPUT_DIRECTORY = './public/dist';

var getClosureCompilerConfiguration = function(outputFile) {
  var closureCompiler = compilerPackage.gulp();
  return closureCompiler({
    externs: [
      compilerPackage.compiler.CONTRIB_PATH + '/externs/jquery-1.9.js',
      path.dirname(__filename) + '/extern/extern.js'
    ],
    warning_level: 'VERBOSE',
    compilation_level: 'ADVANCED_OPTIMIZATIONS',
    js_output_file: outputFile
  });
};


var getLessConfiguration = function() {
  var autoprefix = new lessPluginAutoprefix({
    browsers: ["last 2 versions"]
  });
  var cleanCss = new lessPluginCleanCss({
    advanced: true
  });
  return less({
    plugins: [autoprefix, cleanCss]
  });
};

gulp.task('default', ['js', 'less']);

gulp.task('js', ['js-lint', 'js-compile']);

gulp.task('lint', ['js-lint']);

gulp.task('js-lint', function() {
  return gulp.src([
    './lib/**/*.js',
    './public/js/**/*.js',
    './shared/**/*.js'
  ]).pipe(gjslint({
    flags: ['--jslint_error indentation',
            '--jslint_error well_formed_author',
            '--jslint_error braces_around_type',
            '--jslint_error unused_private_members',
            '--jsdoc',
            '--max_line_length 80',
            '--error_trace'
           ]
  })).pipe(gjslint.reporter('console'));
});

gulp.task('js-compile', function() {
  return merge(JS_BUILD_RULES.map(function(rule) {
    return gulp.src(rule.sourceFiles)
      .pipe(plumber())
      .pipe(getClosureCompilerConfiguration(rule.outputFile))
      .pipe(gulp.dest(OUTPUT_DIRECTORY))
      .on('finish', function() {
        console.log('Finished compiling JS rule ' + rule.name);
      });
  }));
});

gulp.task('less', function() {
  return merge(LESS_BUILD_RULES.map(function(rule) {
    return gulp.src(rule.sourceFiles)
      .pipe(plumber())
      .pipe(getLessConfiguration())
      .pipe(rename(rule.outputFile))
      .pipe(gulp.dest(OUTPUT_DIRECTORY))
      .on('finish', function() {
        console.log('Finished compiling LESS rule ' + rule.name);
      });
  }));
});

gulp.task('clean', function() {
  return del(OUTPUT_DIRECTORY);
});

gulp.task('watch-js', function() {
  gulp.watch([
    './shared/*.js',
    './public/js/*.js',
    './public/js/game/*.js'
  ], ['js']);
});

gulp.task('watch-less', function() {
  gulp.watch('./public/less/*.less', ['less']);
});

gulp.task('watch', ['watch-js', 'watch-less']);
