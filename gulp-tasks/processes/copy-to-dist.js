'use strict';

const gulp = require('gulp'),
      replace = require('gulp-replace'),
      { src, dist, configJS, indexHTML } = global.paths;

gulp.task('copy-general', () => {
  return gulp.src([
      `${src}/**`,
      `!${src}/scss`,
      `!${src}/scss/**`,
      `!${configJS}`,
      `!${indexHTML}`,
    ])
    // .pipe(replace('vue.esm.browser.js', 'vue.esm.browser.min.js')) // NOTE: staat uit, want zorgt alleen maar voor gedoe
    .pipe(gulp.dest(dist));
});

gulp.task('copy-and-alter-configJS', () => {
  return gulp.src(configJS)
             .pipe(replace('const debugMode = true;', 'const debugMode = false;'))
             .pipe(gulp.dest(`${dist}/js`));
});

gulp.task('copy-indexHTML', function (done) {
  // Voegt ?v=[randomstring] toe achter app-fallback.js en app.js in index.html tijdens het kopiëren van index.html.
  const token = `?v=${(+new Date()).toString(36)}`;
  return gulp.src(indexHTML)
             .pipe(replace('js/app.js', `js/${global.app.compiledAppName}${token}`))
             .pipe(gulp.dest(`${dist}`));
});

gulp.task('copy-to-dist', gulp.parallel(
  'copy-general',
  'copy-and-alter-configJS',
  'copy-indexHTML',
));