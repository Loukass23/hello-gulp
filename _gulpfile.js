var gulp = require('gulp'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat')

const { parallel } = require('gulp');


var paths = {
    styles: {
        src: "src/styles/**/*.scss",
        dest: "build/styles"
    },
    js: {
        src: "src/js/**/*.js",
        dest: "build/js"
    },
    index: {
        src: "index.html",
        dest: "build"
    }
}



function style() {
    return gulp
        .src(paths.styles.src)
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(gulp.dest(paths.styles.dest));
}
function copy() {
    return gulp
        .src(paths.index.src)
        .pipe(gulp.dest(paths.index.dest))
}
function js() {
    return gulp
        .src(paths.js.src)
        .pipe(uglify())
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(paths.js.dest));
}

function watch() {
    //I usually run the compile task when the watch task starts as well
    style();

    gulp.watch(paths.styles.src, style);
}
gulp.task('watch', function () {
    gulp.watch('./src/js/*.js', ['js']);
    gulp.watch('./src/styles/main.scss', ['sass']);
});

exports.build = parallel(js, style, copy);

