'use strict';

const gulp = require('gulp');

gulp.task('compile', gulp.series(
  'clean',
  'update-src',
  'copy-to-dist',
  'rollup',
  'finalize-dist',
));