/**
 * @fileoverview Gulpfile for compiling project assets.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import * as del from 'del'
import gulp from 'gulp'
import gulpCssnano from 'gulp-cssnano'
import gulpLess from 'gulp-less'
import gulpRename from 'gulp-rename'
import gulpTypescript from 'gulp-typescript'

const clean = done => {
    del.deleteSync('dist')
    done()
}

const compileTypescript = () => {
    return gulp.src(['src/**/server.ts', 'src/**/client.ts'])
        .pipe(gulpTypescript({
            noImplicitAny: true,
            removeComments: true,
            target: 'es2015',
            moduleResolution: 'node',
        })).pipe(gulpRename(path => {
            path.dirname = ''
        })).pipe(gulp.dest('dist'))
}

const watchTypescript = () => {
    gulp.watch('./src/**/*.js', compileTypescript)
}

const compileLess = () => {
    return gulp.src('./client/less/*.less')
        .pipe(gulpLess())
        .pipe(gulpCssnano())
        .pipe(gulp.dest('dist'))
}

const watchLess = () => {
    gulp.watch('./client/less/*.less', compileLess)
}

const watch = gulp.parallel(watchTypescript, watchLess)

export default {
    clean,
    compile,
    watch,
}