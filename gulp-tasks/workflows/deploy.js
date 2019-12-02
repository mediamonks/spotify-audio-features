'use strict';

const gulp = require('gulp'),
      ghPages = require('gulp-gh-pages'),
      path = require('path'),
      distFiles = path.resolve(global.paths.dist, './**/*');

gulp.task('deploy', () => {
  return gulp.src(distFiles).pipe(ghPages());
});