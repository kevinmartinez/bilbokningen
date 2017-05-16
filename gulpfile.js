const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');

gulp.task('sass', function() {
    return gulp.src('./public/source/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public/dist/css'));
});

// minify CSS with clean-css and put in dist folder
gulp.task('minifyCSS', function() {
    return gulp.src('./public/source/css/*.css')
        .pipe(cleanCSS())
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest('./public/dist/css'));
});

gulp.task('default', function() {
    console.log('hello from moo');
});