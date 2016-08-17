'use strict';

const gulp = require('gulp');
const watch = require('gulp-watch');
const webpack = require('gulp-webpack');
const webpackConfig = require('./webpack.config.js');

gulp.task('default', [ 'build' ]);


gulp.task('build', ['webpack:build-dev']);

// modify some webpack config options
const myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = 'sourcemap';
myDevConfig.debug = true;

function buildDev() {
  return webpack(myDevConfig)
    .pipe(gulp.dest('dist/'));
}

gulp.task('build-dev', ['webpack:build-dev', 'build-dev-watch']);

gulp.task('build-dev-watch', () => {
  return watch(['js/**/*/', 'webpack.config.js'], () => {
    return buildDev();
  });
});

gulp.task('webpack:build-dev', () => {
  return buildDev();
});