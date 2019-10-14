'use strict';

const gulp = require('gulp'),
      path = require('path'),
      chalk = require('chalk'),
      { log } = console,
      { rollup } = require('rollup'),
      { terser } = require('rollup-plugin-terser'),
      { dist } = global.paths;

// This custom rollup plugin makes sure all imports with absolute paths are resolved from the global.cwd directory
function absolutePathResolver () {
  return {
    name: 'absolute-path-resolver', // this name will show up in warnings and errors
    resolveId (importee, importer) {
      if (importer && importer.includes('commonjs-proxy:') === false) {
        if (path.isAbsolute(importee)) {
          const newImportee = `${global.cwd}${importee}`; // importee should already have a leading slash
          console.log(`Rewrote ${chalk.blue(importee)} to ${chalk.blue(newImportee)} in ${chalk.cyan(importer)}`);
          return newImportee;
        }
      }

      return null; // other ids should be handled as usually
    },
  };
}

gulp.task('rollup', async () => {
  log(chalk.bgYellow.black.bold('Compiling ES2015+ bundle'));

  const esmBundle = await rollup({
    input: `${dist}/js/app.js`,
    // NOTE: 'context' is alleen tegen de 'top level this' warning van Rollup. Als je deze warning niet hebt,
    // hoef je hier niets mee te doen. Als je deze warning wel hebt, zoek dan eerst uit waar 'this' naar moest verwijzen.
    // context: 'window',
    plugins: [
      absolutePathResolver(),
      terser(), // ES2015+ minifier
    ],
  });

  await esmBundle.write({
    name: 'rollupped & minified',
    file: `${dist}/js/${global.app.compiledAppName}`,
    format: 'esm',
    compact: false,
    sourcemap: true,
  });

  log(chalk.bgGreen.black.bold('Done compiling ES2015+ bundle'));
});