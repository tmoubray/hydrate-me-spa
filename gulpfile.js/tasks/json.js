var browserSync = require('browser-sync').get('server');
var gulp = require('gulp');
var changed = require('gulp-changed');
var config = require('../config');

gulp.task('programJson', function() {
  return gulp
    .src(config.programJson.src)
    .pipe(changed(config.programJson.dist))
    .pipe(gulp.dest(config.programJson.dist))
    .pipe(browserSync.stream());
});

gulp.task('courseJson', function() {
  return gulp
    .src(config.courseJson.src)
    .pipe(changed(config.courseJson.dist))
    .pipe(gulp.dest(config.courseJson.dist))
    .pipe(browserSync.stream());
});

gulp.task('tuitionJson', function() {
  return gulp
    .src(config.tuitionJson.src)
    .pipe(changed(config.tuitionJson.dist))
    .pipe(gulp.dest(config.tuitionJson.dist))
    .pipe(browserSync.stream());
});
