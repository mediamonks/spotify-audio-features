'use strict';

const gulp = require('gulp'),
      autoprefixer = require('gulp-autoprefixer'),
      sass = require('gulp-sass'),
      sassGlob = require('gulp-sass-glob'),
      sourcemaps = require('gulp-sourcemaps'),
      cleanCSS = require('gulp-clean-css');

/**
  * Use this function in gulp tasks to compile SCSS, minify CSS and create sourcemaps.
  * @param {string} inputPath - Absolute path to all SCSS files, like '/var/www/example/src/scss/*.scss'
  * @param {string} outputPath - Absolute path to where the CSS file should be placed, like '/var/www/example/src/css'
  * @returns {stream} Node/Gulp stream
  */
module.exports = function processCSS(inputPath, outputPath) {
  return gulp.src(inputPath)
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(cleanCSS())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(outputPath))
    .pipe(global.browserSync.stream());
};

// Example:
// const gulp = require('gulp'),
//       path = require('path'),
//       processCSS = require(<wherever this file is at>))
//       cwd = process.cwd(); // current working directory

// gulp.task('css', function () {
//   return processCSS(path.resolve(cwd, './src/scss/**/*.scss'), path.resolve(cwd, './src/css'));
// });
