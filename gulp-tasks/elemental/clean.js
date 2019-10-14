'use strict';

const gulp = require('gulp'),
      fs = require('fs').promises,
      del = require('del'),
      distFolder = global.paths.dist;

gulp.task('clean', async function (done) {
  await del(distFolder);
  await fs.mkdir(distFolder);
});