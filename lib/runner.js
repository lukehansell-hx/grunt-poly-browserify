var browserify = require('browserify');
var watchify = require('watchify');

var _ = {
  each: require('amp-each'),
  extend: require('amp-extend')
};

var Runner = function(grunt){
  this.grunt = grunt;
  this.watchify = watchify;
  this.browserify = browserify;
};

module.exports = Runner;

Runner.prototype.runBundler = function (brand, options, next){
  this.grunt.verbose.writeln('Writing bundle for ' + brand + ':');

  if(!(options.src)){
    return next(new Error('src must be supplied'));
  }

  if(options.watch) {
    options = _.extend({ cache: {}, packageCache: {}, fullPaths: true }, options);
  }

  var b = options.watch ? this.watchify(this.browserify(options.src, options.browserifyOpts), {}) : this.browserify(options.src, options.browserifyOpts);

  if(options.transforms) this.__applyTransforms(b, options.transforms);
  if(options.requires) this.__applyRequires(b, options.requires);
  if(options.externals) this.__applyExternals(b, options.externals);
  if(options.ignores) this.__applyIgnores(b, options.ignores);
  if(options.excludes) this.__applyExcludes(b, options.excludes);

  if (options.watch) {
    b.on('update', this.__onUpdate.bind(this, b, brand, options));
  }

  // Bundle.
  this.__bundle(b, brand, options, next);
};

Runner.prototype.__bundle = function(bundleInstance, brand, options, next) {
  var self = this;
  bundleInstance.bundle(function(err, buf){
    if(err || !buf){
      next(err);
    } else {
      self.grunt.verbose.oklns('Bundling complete for ' + brand);
      self.grunt.file.write(options.dest, buf);
      if (options.keepAlive === true) {
        self.grunt.log.oklns('Watching ' + brand);
        return;
      }
      next();
    }
  });
};

Runner.prototype.__onUpdate = function(browserifyInstance, brand, options, ids) {
  var self = this;
  ids.forEach(function (id) {
    self.grunt.log.oklns(brand + ' changed, updating.');
  });
  this.__bundle(browserifyInstance, brand, options);
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
