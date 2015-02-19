/*
 * grunt-poly-browserify
 * https://github.com/lukehansell/grunt-poly-browserify
 *
 * Copyright (c) 2015 Luke Hansell
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var browserify = require('browserify');
var each = require('each-async');

module.exports = function(grunt) {

  grunt.registerTask('template_branding', 'Grunt plugin to recursively build a site specific .js file for each template following the redirectify structure (including from node_modules).', function() {
    
    var cb = this.async();
    
    grunt.log.subhead("Building branded JS");
    
    var options = this.options({
      brands: ['default'],
      src: path.resolve('./src/index.js'),
      destFolder: path.resolve('./public/js/')
    });

    grunt.log.writeln('Using brands:\n', this.options().brands.join("\n "));
    grunt.verbose.writeln('Building from main file', options.main);

    var brands = this.options().brands;
    if(brands.indexOf('default') == -1){ brands.push('default'); } // add default if not included
    
    each(brands, function( brand, index, next ) {
      if(brand == 'default') {
        __runBundler(options, next); // build default bundle
      } else {
        __runBundler(brand, options, next); // build branded bundles
      }
    }, function(err){
      if(err){
        grunt.log.error(err);
      } else {
        grunt.log.oklns('Bundling Complete');
        cb();
      }
    });
    
  });
  
  function __runBundler(brand, options, next){
  
    var defaultFile = false;
    if(arguments.length == 2){
      next = options;
      options = brand;
      brand = null;
      defaultFile = true;
    }

    var outputFileName = (defaultFile) ? 'app.js' : brand + '_app.js';

    if(defaultFile){
      grunt.verbose.writeln('Writing default bundle:');
    } else {
      grunt.verbose.writeln('Writing bundle for', brand, ':');
    }

    var b = browserify();
    
    if(!defaultFile){ // redirectify isn't required for the default bundle
      b.transform('redirectify', {
        dir: brand,
        global: true
      });
    }
    
    b.transform('reactify', { global: true })
      .add(options.src)
      .bundle(function(err, buf){
        if(err || !buf){
          next(err);
        } else {
          if(defaultFile){
            grunt.verbose.oklns('Bundling complete for default');
          } else {
            grunt.verbose.oklns('Bundling complete for ' + brand);
          }
          grunt.file.write(path.resolve(options.destFolder, outputFileName), buf);
          next()
        }
      });
  }
  
};