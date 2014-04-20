/* global module: false */

// Karma configuration
// Generated on Sun Mar 23 2014 14:05:19 GMT-0500 (CDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'spec/spec-utils/force-shadowdom-polyfill.js',
      'bower_components/platform/platform.js',

      // TODO(pwong): Reference to node_modules once 0.0.34 is released
      'vendor/traceur-runtime.js',
      // TODO(pwong): Reference to node_modules once this provided by the npm package
      'vendor/es6-module-loader-sans-promises.js',
      // TODO(pwong): Reference to node_modules once 0.5.4 is released
      'vendor/system-amd-production.min.js',

      'spec/spec-utils/__spec-globals__.js',
      'test-main.js',

      {pattern: 'build/**/*',              included: false},
      {pattern: 'vendor/**/*',             included: false},
      {pattern: 'bower_components/**/*',   included: false},
      {pattern: 'spec_build/**/*.js',      included: false},
      {pattern: 'spec_build/**/*.map',     included: false}
    ],


    // list of files to exclude
    exclude: [

    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {

    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
