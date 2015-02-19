# grunt-poly-browserify

> Grunt plugin to build multiple Browserify bundles from one source file.

As the name suggests, this grunt tasks builds Browserify bundles. Using this plugin you can create multiple bundles
from a single starting file. For instance you can easily build a minified and non-minified version of you package in
one build step.

This plugin allows you to specify different transforms, excludes, includes etc for each of your required bundles.


## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-poly-browserify --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-poly-browserify');
```

## The "poly_browserify" task

### Overview
In your project's Gruntfile, add a section named `poly_browserify` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  poly_browserify: {
    options: {
      src: 'src/file/to/build/from'
      dest: 'path/to/output'
      transforms: [],
      requires: [],
      externals: [],
      ignores: [],
      excludes: [],
      browserifyOpts: {},
      bundleDefault: false,
      bundles: [
        {
          name: 'bundle name',
          options: {}
      ]
    }
  }
});
```

### Options

#### options.src
Type: `String`

The default starting file that grunt-poly-browserify will read from when bundling.

#### options.dest
Type: `String`

The default destination file. This is only required if you intend on bundling the default settings, but is then a
required option.

#### options.transforms
Type: `Array`
Default: `[]`

This is an array of transforms to be used and can be a string, function or array for specifying additional options.
For example:

- `transforms: [ 'uglify' ]` for a string
- `transforms: [ function(){} ]` for a function
- `transforms: [ [ 'stringOrFunction', {global: true} ] ]` for the array

You can specify more than one transform:

`transforms: [ 'uglify', 'reactify' ]`

The format follows that specified in the [Browserify API for transforms](https://github.com/substack/node-browserify#btransformtr-opts).

#### options.requires, options.externals, options.ignores, options.excludes
Type: `Array`
Default: `[]`

An array of params for Browserify, following the [Browserify API definitions](https://github.com/substack/node-browserify#methods).

#### options.browserifyOptions
Type: `Object`
Default: `{}`

An object of options which is passed directly to Browserify on instantiation.

#### options.bundleDefault
Type: `Boolean`
Default: `false`

A flag which dictates whether or not to build a bundle using the default settings.

If true then the `options.dest` param must be provided.

#### options.bundles
Type: `Array`
Default: `[]`

This is where you specify your bundles to build. Each bundle follows the following layout:

`
{
  name: 'bundleName'
  options: {}
}
`

##### bundle.name
Type: `String`

The name of your bundle

##### bundle.options
Type: `Object`

This object is used when building your bundles. The options provided here overwrite the default options. For example:

`
{
  src: 'source.js'
  dest: 'foo.js'
  bundles: [
    {
      name: 'bar',
      dest: 'bar.js'
    }
  ]
}
`

The above example would write the output to the file `bar.js`.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
