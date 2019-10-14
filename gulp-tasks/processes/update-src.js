'use strict';

const gulp = require('gulp');

// Execute all gulp tasks that should make sure the src directory is up to date,
// e.g. compiling css, processing markdown, aggregating SVGs, analysing a spreadsheet
gulp.task('update-src', gulp.series(
  'css',
));