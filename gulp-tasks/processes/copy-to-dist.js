'use strict';

const gulp = require('gulp'),
      replace = require('gulp-replace'),
      path = require('path'),
      chalk = require('chalk'),
      { src, dist, configJS, indexHTML, distVendorJS } = global.paths;

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
             .pipe(replace('const production = false;', 'const production = true;'))
             .pipe(gulp.dest(`${dist}/js`));
});

gulp.task('copy-indexHTML', async () => {
  // Adds ?v=[randomstring] to main JS file script tags in index.html while copying index.html and changes filename of bundles files script tags.
  const token = `?v=${(+new Date()).toString(36)}`,
        vendorJSFilesToCopy = [];

  await new Promise((resolve, reject) => {
    gulp.src(indexHTML)
        .pipe(replace('js/app.js', `js/${global.app.compiledAppName}${token}`))
        .pipe(replace('js/app-fallback.js', `js/${global.app.compiledAppFallbackName}${token}`))
        // When node modules with JS we need to use don't provide an ESM version, we have to copy them to the dist folder manually
        // IDEA: Improvement for later projects: move .js files to –> /js, .css (+ .css.map) files to –> /css
        .pipe(replace(/\/node_modules\/.*(?=\")/g, (match) => {
          vendorJSFilesToCopy.push(match);
          return path.join(path.relative(dist, distVendorJS), path.basename(match));
        }))
        .pipe(gulp.dest(`${dist}`))
        .on('end', resolve);
  });

  const vendorJSCopyPromises = [];
  for (const vendorJSFileToCopy of vendorJSFilesToCopy) {
    vendorJSCopyPromises.push(
      new Promise((resolve, reject) => {
        gulp.src(path.join(global.cwd, vendorJSFileToCopy))
            .pipe(gulp.dest(`${distVendorJS}`))
            .on('end', resolve);
      })
    );

    console.log(`Copied vendor JS ${chalk.blue(vendorJSFileToCopy)} to ${chalk.blue(distVendorJS)}`);
  }

  await Promise.all(vendorJSCopyPromises);
});

gulp.task('copy-to-dist', gulp.parallel(
  'copy-general',
  'copy-and-alter-configJS',
  'copy-indexHTML',
));