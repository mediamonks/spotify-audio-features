'use strict';

const gulp = require('gulp'),
      del = require('del');

gulp.task('finalize-dist', async () => {
  await del([
    `${global.paths.dist}/js/**`,
    `!${global.paths.dist}/js`,
    `!${global.paths.dist}/js/${global.app.compiledAppName}`,
  ]);
});