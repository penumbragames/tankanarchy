/**
 * @fileoverview Gulpfile for compiling project assets.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import * as del from 'del'
import gulp from 'gulp'
import gulpCssnano from 'gulp-cssnano'
import gulpLess from 'gulp-less'
import gulpTypescript from 'gulp-typescript'

const tsProject = gulpTypescript.createProject('tsconfig.json')

const clean = () => del.deleteAsync('dist')

const copy = () => gulp.src('views/index.html').pipe(gulp.dest('dist/views'))

const compileTypescript = () => tsProject.src()
  .pipe(tsProject())
  .js
  .pipe(gulp.dest('dist'))

const watchTypescript = () => {
  gulp.watch('./src/**/*.ts', compileTypescript)
}

const compileLess = () => gulp.src('./client/less/*.less')
  .pipe(gulpLess())
  .pipe(gulpCssnano())
  .pipe(gulp.dest('dist'))

const watchLess = () => {
  gulp.watch('./client/less/*.less', compileLess)
}

const watch = gulp.parallel(watchTypescript, watchLess)

const compile = gulp.parallel(compileTypescript, compileLess)

export {
  copy,
  clean,
  compileTypescript,
  compileLess,
  compile,
  watch,
  watchTypescript,
  watchLess,
  watch as default,
}
