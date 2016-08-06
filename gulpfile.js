var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var concat = require('gulp-concat');
var watch = require('gulp-watch');

gulp.task('less', function() {
    return gulp.src('./less/**/*.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(gulp.dest('./css-temp/'));
});

gulp.task('buildcss', ['less'], function() {
    return gulp.src('./css-temp/*.css')
        .pipe(concat('app.css'))
        .pipe(gulp.dest('./app/'));
});

gulp.task('watch-less', ['buildcss'], function() {
    gulp.watch('./less/**/*.less', ['buildcss']);
});
