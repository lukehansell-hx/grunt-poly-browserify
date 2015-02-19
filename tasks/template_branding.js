/*
 * grunt-poly-browserify
 * https://github.com/lukehansell-hx/grunt-poly-browserify
 *
 * Copyright (c) 2015 Luke Hansell
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var each = require('each-async');
var _ = {
  each: require('amp-each'),
  extend: require('amp-extend'),
  union: require('amp-union')
};

var Runner = require('../lib/runner');

module.exports = function(grunt) {

  grunt.registerTask('poly_browserify', 'Grunt plugin to build multiple browserify bundles from one source file.', function() {
    
    var runner = new Runner(grunt);
    var cb = this.async();
    
    var options = this.options({
      transforms: [],
      requires: [],
      externals: [],
      ignores: [],
      excludes: [],
      browserifyOpts: {},
      bundleDefault: false,
      bundles: []
    });

    if(!options.src){
      grunt.log.error('Source file must be specified [options.src]');
      return cb();
    }
    
    if(options.bundleDefault && !options.dest){
      grunt.log.error('Default destination must be provided to build the default [options.dest]');
      return cb();
    }

    grunt.verbose.writeln('Bundling from main file', options.src);

    var bundles = options.bundles;
    delete options.bundles;
    if(options.bundleDefault){ bundles.push({name:'default', options: {}}) }
    
    each(bundles, function( bundle, index, next ) {
        var bundleOptions = _.extend({}, options, bundle.options);
        runner.runBundler(bundle.name, bundleOptions, next); // build branded bundles
    }, function(err){
      if(err){
        grunt.log.error(err);
      } else {
        grunt.log.oklns('Bundling Complete');
        cb();
      }
    });
    
  });
};