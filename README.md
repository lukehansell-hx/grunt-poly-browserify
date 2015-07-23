# grunt-poly-browserify

> Grunt plugin to build multiple Browserify bundles from one source file.

As the name suggests, this grunt tasks builds [Browserify](http://browserify.org/) bundles. Using this plugin you can create multiple bundles
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
      watch: false,
      keepAlive: false
    },
    bundle_one: {
      options: {
        dest: 'path/to/dest/override'
      }
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

#### options.watch
Type: `Boolean`
Default: `false`

Use watchify instead of browserify to watch the source for changes and recompile automatically.

#### options.keepAlive
Type: `Boolean`
Default: `false`

Keep the task alive in conjunction with `watch`.

### Adding bundle outputs

To output a bundle you must specify it's configuration (see `poly_browserify.bundle_one` in example above).
You can specify as many bundles to build as you require and by specifying options in the bundle config you can override
the defaults to do whatever you require.

##### *bundle_name*.options
Type: `Object`

This object is used when building your bundles. The options provided here overwrite the default options. For example:

`
{
  options: {
    src: 'source.js'
    dest: 'foo.js'
  },
  bundle_one: {
    dest: 'bar.js'
  }
}
`

Running the plugin with the above options would write the output to the file `bar.js`.

## Running on the Command line
On the command line you can run all bundles specified in the options with:

`grunt poly_browserify`

Or you can run a specific bundle by specifying it as follows:

`grunt poly_browserify:[bundle_name]'

e.g:

`grunt poly_browserify:bundle_one`

## Example

Using one entry point to an app we require multiple *.js* files to be created. This will allow us to override the branding on
the generated single page apps.

For this we will be using [redirectify](https://www.npmjs.com/package/redirectify), a browserify transform which allows me
to override files loaded based on a provided directory.

My file structure therefore looks like the following:

```
app.js
- script
    - brand_a
        - feature1.js
    - feature1.js
    - feature2.js
```

In this example `app.js` requires `script/feature1.js` and `script/feature2.js`.
We want to build 2 *.js* files: the `default.js` and `brand_a.js`. `brand_a.js` should use overriding files for brand
specific functionality where available `script/brand_a/feature1.js` instead of `script/feature1.js`.

Using redirectify we can specify that, when attempting to load a file, browserify should check to see if a directory of
the name `brand_a` exists. If so, and the requested filename also exists in that directory, load the file from that directory.
This way, if app.js contains the following code:

```
var f1 = require('./script/feature1');
var f2 = require('./script/feature2');
```
and we specify `brand_a` as our overriding directory we can load `./script/brand_a/feature1.js`, but since
`./script/brand_a/feature2.js` doesn't exist `./script/feature2.js` is used.

Using grunt_poly_browserify we can automate the building of these two distinct files. My configuration in the gruntfile
would look like this:

```
poly_browserify: {
  options: {
    dest: 'default.js',
    src: 'app.js'
  },
  brand_a: {
    options: {
      dest: 'brand_a.js',
      transforms: [
        ['redirectify', {dir: 'brand_a'}]
      ]
    }
  },
  default: {}
}
```

When building the brand `default` from this config then the default params provided in `poly_browserify.options` are used
so the file is written to `default.js` from `app.js` and the default features are required.

However, when building `brand_a` the config provided is overwritten by the params specified in `poly_browserify.brand_a.options`.
Therefore the output file is `brand_a.js`, but the source file is still `app.js`. Also, because redirectify is specified as
a transform, with the overriding directory `brand_a`, `script/brand_a/feature1` is required instead of the default.

After running `grunt poly_browserify` we will now have two new files: `default.js` and `brand_a.js` which contain
the default and overwritten bundled javascript.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
