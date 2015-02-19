/*
 * grunt-poly-browserify
 * https://github.com/lukehansell-hx/grunt-poly-browserify
 *
 * Copyright (c) 2015 Luke Hansell
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ]
    },

    // Configuration to be run (and then tested).
    template_branding: {
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
};
