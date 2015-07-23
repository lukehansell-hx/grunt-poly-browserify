/*
 * grunt-poly-browserify
 * https://github.com/lukehansell-hx/grunt-poly-browserify
 *
 * Copyright (c) 2015 Luke Hansell
 * Licensed under the MIT license.
 */

var _ = {
  extend: require('amp-extend')
};

var Runner = require('../lib/runner');

module.exports = function(grunt) {

  grunt.registerMultiTask('poly_browserify', 'Grunt plugin to build multiple browserify bundles from one source file.', function() {

    var runner = new Runner(grunt);
    var cb = this.async();

    var options = this.options({
      transforms: [],
      requires: [],
      externals: [],
      ignores: [],
      excludes: [],
      browserifyOpts: {},
      watch: false,
      keepAlive: false
    });

    if(!options.src){
      grunt.log.error('Source file must be specified [options.src]');
      return cb();
    }

    if(!options.dest){
      grunt.log.error('Destination file must be specified [options.dest]');
      return cb();
    }

    grunt.verbose.writeln('Bundling from main file ' + options.src + ' to ' + options.dest);
    runner.runBundler(this.target, options, cb);

  });
};
