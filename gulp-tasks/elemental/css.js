'use strict';

const gulp = require('gulp'),
      path = require('path'),
      processCSS = require(path.resolve(global.gulpTasksDir, './elemental/process-css.js'));

gulp.task('css', function () {
  return processCSS(`${global.paths.scss}/**/*.scss`, global.paths.css);
});