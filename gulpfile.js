/**
 * @fileoverview Gulpfile for compiling project assets.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import * as del from 'del'
import browserify from 'browserify'
import gulp from 'gulp'
import gulpCssnano from 'gulp-cssnano'
import gulpLess from 'gulp-less'
import gulpTypescript from 'gulp-typescript'
import tsify from 'tsify'
import vinylBuffer from 'vinyl-buffer'
import vinylStream from 'vinyl-source-stream'

const clean = () => del.deleteAsync('dist')

const copyHTML = () => gulp.src('html/index.html').pipe(gulp.dest('dist/html'))
const watchHTML = () => gulp.watch('./html/*', copyHTML)

const copyIMG = () => gulp.src('img/*.png').pipe(gulp.dest('dist/img'))

const serverTypescriptFiles = [
  './src/server.ts',
  './src/server/*.ts',
  './src/lib/*.ts',
]
const compileTypescriptServer = () =>
  gulp
    .src(serverTypescriptFiles, { base: './src' })
    .pipe(
      gulpTypescript({
        noImplicitAny: true,
        target: 'es2015',
        rootDir: './src',
        removeComments: true,
        moduleResolution: 'node',
        module: 'es2020',
        allowSyntheticDefaultImports: true,
      }),
    )
    .pipe(gulp.dest('dist'))
const watchTypescriptServer = () =>
  gulp.watch(serverTypescriptFiles, compileTypescriptServer)

// TODO(omgimanerd): Catch errors in stream and fail gracefully
const compileTypescriptClient = () =>
  browserify({
    entries: ['./src/client.ts'],
    debug: true,
    cache: {},
    packageCache: {},
  })
    .plugin(tsify, { noImplicitAny: true, target: 'es6' })
    .bundle()
    .pipe(vinylStream('client.js'))
    .pipe(vinylBuffer())
    .pipe(gulp.dest('dist'))
const watchTypescriptClient = () =>
  gulp.watch(
    ['./src/client/*.ts', './src/client.ts', './src/lib/*.ts'],
    compileTypescriptClient,
  )

const compileLess = () =>
  gulp
    .src('./less/*.less')
    .pipe(gulpLess())
    .pipe(gulpCssnano())
    .pipe(gulp.dest('dist/css'))
const watchLess = () => gulp.watch('./less/*.less', compileLess)

const compile = gulp.parallel(
  copyHTML,
  copyIMG,
  compileTypescriptServer,
  compileTypescriptClient,
  compileLess,
)

const watch = gulp.parallel(
  watchTypescriptServer,
  watchTypescriptClient,
  watchLess,
  watchHTML,
)

export {
  clean,
  copyHTML,
  copyIMG,
  compileTypescriptServer,
  compileTypescriptClient,
  compileLess,
  watchLess,
  compile,
  watch,
  watch as default,
}
