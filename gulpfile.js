const gulp = require("gulp");
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");
const htmlmin = require("gulp-htmlmin");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const sass = require('gulp-sass');
const del = require("del");
const connect = require('gulp-connect');



const paths = {
    source: "./src",
    build: "./build"
};

function cleanup() {
    // Simply execute del with the build folder path
    return del([paths.build]);
}
function cssBuild() {
    return gulp
        .src(`${paths.source}/styles/**/*.css`)
        .pipe(postcss([cssnano()]))
        .pipe(gulp.dest(`${paths.build}/styles`))
        .pipe(connect.reload());

}

function htmlBuild() {
    return gulp
        .src(`${paths.source}/*.html`)
        .pipe(htmlmin())
        .pipe(gulp.dest(paths.build))
        .pipe(connect.reload());

}
function javascriptBuild() {
    return (
        browserify({
            entries: [`${paths.source}/scripts/main.js`],
            transform: [babelify.configure({ presets: ["@babel/preset-env"] })]
        })
            .bundle()
            .pipe(source("bundle.js"))
            // Turn it into a buffer!
            .pipe(buffer())
            // And uglify
            .pipe(uglify())
            .pipe(gulp.dest(`${paths.build}/scripts`))
            .pipe(connect.reload())

    );
}

function scss() {
    return gulp
        .src(`${paths.source}/styles/**/*.scss`)
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(gulp.dest(`${paths.build}/styles`))
        .pipe(connect.reload());


}


function serveTask(done) {
    connect.server({
        root: 'build',
        livereload: true,
        port: 8000,
    }, function () { this.server.on('close', done) })
}

function watchTask(done) {
    gulp.watch('src', gulp.parallel(javascriptBuild, cssBuild, scss, htmlBuild))
    // .on('change', browserSync.reload)
    done()
}


exports.build = gulp.series(cleanup, gulp.parallel(javascriptBuild, cssBuild, scss, htmlBuild))
exports.watch = gulp.parallel(serveTask, watchTask)
