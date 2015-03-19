var browserify = require('browserify');
var _ = {
  each: require('amp-each')
};

var Runner = function(grunt){
  this.grunt = grunt;
};

module.exports = Runner;

Runner.prototype.runBundler = function (brand, options, next){
  
  var self = this;
  
  this.grunt.verbose.writeln('Writing bundle for ' + brand + ':');

  if(!(options.src)){
    return next(new Error('src must be supplied'));
  }
  
  var b = browserify(options.src, options.browserifyOpts || {});
  
  if(options.transforms) this.__applyTransforms(b, options.transforms);
  if(options.requires) this.__applyRequires(b, options.requires);
  if(options.externals) this.__applyExternals(b, options.externals);
  if(options.ignores) this.__applyIgnores(b, options.ignores);
  if(options.excludes) this.__applyExcludes(b, options.excludes);
  
  b.bundle(function(err, buf){
    if(err || !buf){
      next(err);
    } else {
      self.grunt.verbose.oklns('Bundling complete for ' + brand);
      self.grunt.file.write(options.dest, buf);
      next();
    }
  });
};
  
Runner.prototype.__applyTransforms = function( bundleInstance, transforms ){
  _.each(transforms, function(transform){
    if( transform.constructor === Array ){
      var tOpts = transform[1] || {};
      bundleInstance.transform(transform[0], tOpts);
    } else {
      bundleInstance.transform(transform);
    }
  });
  return bundleInstance;
};

Runner.prototype.__applyRequires = function( bundleInstance, requires ){
  _.each(requires, function(require){
    bundleInstance.require(require);
  });
  return bundleInstance;
};

Runner.prototype.__applyExternals = function( bundleInstance, externals ){
  _.each(externals, function(external){
    bundleInstance.external(external);
  });
};

Runner.prototype.__applyIgnores = function( bundleInstance, ignores ){
  _.each(ignores, function(ignore){
    bundleInstance.ignore(ignore);
  });
};

Runner.prototype.__applyExcludes = function( bundleInstance, excludes ){
  _.each(excludes, function(exclude){
    bundleInstance.exclude(exclude);
  });
};

