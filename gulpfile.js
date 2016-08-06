/**
 * Multipurpose Javascript Task Runner to compile my projects.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 * @version 1.1.0
 */

try {
  var gulp = require('gulp');
  var merge = require('merge-stream');
} catch (error) {
  console.error(error.message);
  process.exit(0);
}

try {
  var BUILD = require('./BUILD');
} catch (error) {
  console.error('Unable to locate BUILD.js');
  process.exit(0);
}

gulp.task('default', ['js', 'less']);

gulp.task('js', ['js-lint', 'js-compile']);

gulp.task('lint', ['js-lint']);

gulp.task('js-lint', function() {
  if (BUILD.JS_LINT_RULES) {
    try {
      var gjslint = require('gulp-gjslint');
    } catch (error) {
      console.error(error.message);
      return;
    }
    return merge(BUILD.JS_LINT_RULES.map(function(rule) {
      return gulp.src(rule.sourceFiles).pipe(gjslint({
        flags: ['--jslint_error indentation',
                '--jslint_error well_formed_author',
                '--jslint_error braces_around_type',
                '--jslint_error unused_private_members',
                '--jsdoc',
                '--max_line_length 80',
                '--error_trace'
               ]
      })).pipe(gjslint.reporter('console'))
         .on('finish', function() {
           console.log('Finished linting ' + rule.name);
         });
    }));
  }
});

gulp.task('js-compile', function() {
  if (BUILD.JS_BUILD_RULES) {
    try {
      var path = require('path');
      var compilerPackage = require('google-closure-compiler');
      var plumber = require('gulp-plumber');
    } catch (error) {
      console.error(error.message);
      return;
    }

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

    return merge(BUILD.JS_BUILD_RULES.map(function(rule) {
      return gulp.src(rule.sourceFiles)
        .pipe(plumber())
        .pipe(getClosureCompilerConfiguration(rule.outputFile))
        .pipe(gulp.dest(rule.outputDirectory))
        .on('finish', function() {
          console.log('Finished compiling ' + rule.name);
        });
    }));
  }
});

gulp.task('less', function() {
  if (BUILD.LESS_BUILD_RULES) {
    try {
      var less = require('gulp-less');
      var plumber = require('gulp-plumber');
      var rename = require('gulp-rename');
      var lessPluginAutoprefix = require('less-plugin-autoprefix');
      var lessPluginCleanCss = require('less-plugin-clean-css');
    } catch (error) {
      console.error(error.message);
    }

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

    return merge(BUILD.LESS_BUILD_RULES.map(function(rule) {
      return gulp.src(rule.sourceFiles)
        .pipe(plumber())
        .pipe(getLessConfiguration())
        .pipe(rename(rule.outputFile))
        .pipe(gulp.dest(rule.outputDirectory))
        .on('finish', function() {
          console.log('Finished compiling ' + rule.name);
        });
    }));
  }
});

gulp.task('watch-js', function() {
  BUILD.JS_BUILD_RULES.map(function(rule) {
    gulp.watch(rule.sourceFiles, ['js'])
  });
});

gulp.task('watch-less', function() {
  BUILD.LESS_BUILD_RULES.map(function(rule) {
    gulp.watch(rule.sourceFiles, ['less']);
  })
});

gulp.task('watch', ['watch-js', 'watch-less']);
