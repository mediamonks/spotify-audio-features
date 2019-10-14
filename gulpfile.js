'use strict';

////////////////////////////////////////////////////
// Preparations
////////////////////////////////////////////////////

const gulp = require('gulp'),
      path = require('path'),
      requireDir = require('require-dir');

// Save current working directory in global.cwd.
const cwd = global.cwd = process.cwd();

// Save gulp-tasks directory in global.gulpTasksDir.
const gulpTasksDir = global.gulpTasksDir = path.resolve(cwd, './gulp-tasks');

// Use this function to require all js files in directory 'dir', relative to the gulpTasksDir
// This makes setting up complex gulp workflows easier
const registerGulpTasks = dir => requireDir(path.resolve(gulpTasksDir, dir), { recurse: false });

// Create browserSync instance
global.browserSync = require('browser-sync').create();


////////////////////////////////////////////////////
// Define the app
////////////////////////////////////////////////////

global.app = {
  compiledAppName: 'bundle.js',
  compiledAppFallbackName: 'bundle-fallback.js',
};

// Define paths
global.paths = {
  src:            path.resolve(cwd, './src'),
  dist:           path.resolve(cwd, './dist'),

  indexHTML:      path.resolve(cwd, './src/index.html'),
  html:           path.resolve(cwd, './src/**/*.html'),
  js:             path.resolve(cwd, './src/js'),
  configJS:       path.resolve(cwd, './src/js/config.js'),
  scss:           path.resolve(cwd, './src/scss'),
  css:            path.resolve(cwd, './src/css'),
};


////////////////////////////////////////////////////
// Register gulp tasks
////////////////////////////////////////////////////

// Microscopic tasks that run independently
registerGulpTasks('./elemental');

// Somewhat larger processes, like watching and compiling scss files
registerGulpTasks('./processes');

// Workflows, like compile/deploy/test/serve
registerGulpTasks('./workflows');


gulp.task('default', gulp.series('serve'));