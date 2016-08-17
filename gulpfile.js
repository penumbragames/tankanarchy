/**
 * Multipurpose Javascript Task Runner to compile my projects.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 * @version 2.0.0
 */

const version = "2.0.0";

var semver = require('semver');

var gulp = require('gulp');
var merge = require('merge-stream');

try {
  var BUILD = require('./BUILD');
  if (semver.gt(BUILD.GULPFILE_VERSION, version)) {
    console.warn('Your gulpfile.js is outdated and may not work properly!');
  } else if (semver.gt(version, BUILD.GULPFILE_VERSION)) {
    console.warn('Your BUILD.js is using an older format. Consider updating ' +
        'it as certain features may not work.');
  }
} catch (error) {
  throw new Error('Unable to locate BUILD.js');
}

gulp.task('default', BUILD.DEFAULT_TASKS || ['js', 'less', 'sass']);

gulp.task('js', ['js-lint', 'js-compile']);

gulp.task('lint', ['js-lint']);

gulp.task('js-lint', function() {
  if (BUILD.JS_LINT_RULES) {
    var gjslint = require('gulp-gjslint');

    return merge(BUILD.JS_LINT_RULES.map(function(rule) {
      // Set default flags to be used for gulp-gjslint
      var flags = [
        '--jslint_error indentation',
        '--jslint_error well_formed_author',
        '--jslint_error braces_around_type',
        '--jslint_error unused_private_members',
        '--jsdoc',
        '--max_line_length 80',
        '--error_trace'
      ] || rule.flags;
      return gulp.src(rule.sourceFiles).pipe(gjslint({
        flags: flags
      })).pipe(gjslint.reporter('console'))
         .on('finish', function() {
           console.log('Finished linting ' + rule.name);
         });
    }));
  } else {
    console.warn('JS_LINT_RULES are not defined in your BUILD.js');
  }
});

gulp.task('js-compile', function() {
  if (BUILD.JS_BUILD_RULES) {
    var path = require('path');
    var compilerPackage = require('google-closure-compiler');
    var plumber = require('gulp-plumber');

    var closureCompiler = compilerPackage.gulp();
    var getClosureCompilerConfiguration = function(externs, compilationLevel,
                                                   outputFile) {
      return closureCompiler({
        externs: externs,
        warning_level: 'VERBOSE',
        compilation_level: compilationLevel,
        js_output_file: outputFile
      });
    };

    return merge(BUILD.JS_BUILD_RULES.map(function(rule) {
      return gulp.src(rule.sourceFiles)
        .pipe(plumber())
        .pipe(getClosureCompilerConfiguration(rule.externs,
                                              rule.compilationLevel,
                                              rule.outputFile))
        .pipe(gulp.dest(rule.outputDirectory))
        .on('end', function() {
          console.log('Finished compiling ' + rule.name + ' with ' +
              rule.compilationLevel);
        });
    }));
  } else {
    console.warn('JS_BUILD_RULES are not defined in your BUILD.js');
  }
});

gulp.task('less', function() {
  if (BUILD.LESS_BUILD_RULES) {
    var less = require('gulp-less');
    var plumber = require('gulp-plumber');
    var rename = require('gulp-rename');
    var lessPluginAutoprefix = require('less-plugin-autoprefix');
    var lessPluginCleanCss = require('less-plugin-clean-css');

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
        .on('end', function() {
          console.log('Finished compiling ' + rule.name);
        });
    }));
  } else {
    console.warn('LESS_BUILD_RULES are not defined in your BUILD.js');
  }
});

gulp.task('sass', function() {
  if (BUILD.SASS_BUILD_RULES) {
    var sass = require('gulp-sass');
    var plumber = require('gulp-plumber');
    var rename = require('gulp-rename');

    return merge(BUILD.SASS_BUILD_RULES.map(function(rule) {
      return gulp.src(rule.sourceFiles)
        .pipe(plumber())
        .pipe(sass({
          outputStyle: 'compressed'
        }))
        .pipe(rename(rule.outputFile))
        .pipe(gulp.dest(rule.outputDirectory))
        .on('end', function() {
          console.log('Finished compiling ' + rule.name);
        })
    }));
  } else {
    console.warn('SASS_BUILD_RULES are not defined in your BUILD.js');
  }
});

gulp.task('clean', function() {
  if (BUILD.CLEAN_PROJECT_PATHS) {
    var del = require('del');
    return del(BUILD.CLEAN_PROJECT_RULES).then(function(paths) {
      console.log('Cleaned:\n' + paths.join('\n'));
    });
  } else {
    console.warn('CLEAN_PROJECT_RULES are not defined in your BUILD.js');
  }
});

gulp.task('test', function() {
  if (BUILD.JASMINE_TEST_PATHS) {
    var jasmine = require('gulp-jasmine');
    return gulp.src(BUILD.JASMINE_TEST_PATHS)
      .pipe(jasmine()).on('end', function() {
        console.log('Finished running unit tests');
      });
  } else {
    console.warn('JASMINE_TEST_PATHS are not defined in your BUILD.js');
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

gulp.task('watch-sass', function() {
  BUILD.SASS_BUILD_RULES.map(function(rule) {
    gulp.watch(rule.sourceFiles, ['sass']);
  })
});

gulp.task('watch', ['watch-js', 'watch-less', 'watch-sass']);
