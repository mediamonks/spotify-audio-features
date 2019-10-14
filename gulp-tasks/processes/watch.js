'use strict';

const gulp = require('gulp');

gulp.task('browsersync', (done) => {
  global.browserSync.init({
    server: {
      baseDir: global.paths.src,
      routes: {
        // route die benaderen van 'node_modules' map mogelijk maakt
        // vanuit de 'src' map, als die map geserveerd wordt door browserSync.
        '/node_modules': './node_modules'
      },
    },
    ghostMode: false
  });

  done();
});

gulp.task('watch', (done) => {
  const interval = { interval: 500 };
  gulp.watch([global.paths.html, global.paths.js], interval).on('change', global.browserSync.reload);
  gulp.watch(global.paths.scss, interval, gulp.series('css'));

  done();
});