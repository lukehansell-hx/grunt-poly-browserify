/*
 * grunt-poly-browserify
 * https://github.com/lukehansell-hx/grunt-poly-browserify
 *
 * Copyright (c) 2015 Luke Hansell
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  
  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        'lib/*.js'
      ]
    },

    // Configuration to be run (and then tested).
    poly_browserify: {},

    // Unit tests.
    mochaTest: {
      test: {
        src: ['tests/**/*_test.js']
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('default', ['jshint', 'test']);
};
