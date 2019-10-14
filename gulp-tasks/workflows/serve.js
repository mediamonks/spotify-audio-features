'use strict';

const gulp = require('gulp');

gulp.task('serve', gulp.series(
  'update-src',
  'browsersync',
  'watch',
));