var grunt = require('grunt');
var should = require('chai').should();
var sinon = require('sinon');

var Runner = require('../../lib/runner');

describe('runner.js', function(){

  beforeEach(function(){
    this.runner = new Runner(grunt);
  });
  
  describe('instantiation', function(){
    it('should be requireable without erroring', function(){
      should.not.Throw(require('../../lib/runner'));
    });
    it('should return an instance of Runner', function(){
      require('../../lib/runner').should.be.a('function');
    });
  });
  describe('runBundler()', function(){
  
    beforeEach(function(){
      this.cb = sinon.spy();
    });
  
    describe('without src', function(){
      beforeEach(function(){
        this.runner.runBundler('foo',{browserifyOptions:{}}, this.cb)
      });

      it('should call callback', function(){
        this.cb.called.should.equal(true);
      });
      
      it('should pass an error to callback', function(){
        this.cb.args[0][0].should.be.instanceOf(Error);
      });
    });
    
    describe('options.transforms', function(){
      beforeEach(function(){
        this.runner__applyTransforms = sinon.spy(this.runner, '__applyTransforms');
      });
      
      afterEach(function(){
        this.runner__applyTransforms.restore();
      });
         
      describe('are included', function(){
        beforeEach(function(){
          this.runner.runBundler('foo',{src:'bar.js', transforms: {}}, this.cb);
        });

        it('calls __applyTransforms', function(){
          this.runner__applyTransforms.called.should.equal(true);
        });
      });
      
      describe('are not included', function(){
        beforeEach(function(){
          this.runner.runBundler('foo',{src:'bar.js'}, this.cb);
        });

        it('does not call __applyTransforms', function(){
          this.runner__applyTransforms.called.should.not.equal(true);
        });
      });
    });
    
    describe('options.requires', function(){
      beforeEach(function(){
        this.runner__applyRequires = sinon.spy(this.runner, '__applyRequires');
      });

      afterEach(function(){
        this.runner__applyRequires.restore();
      });

      describe('are included', function(){
        beforeEach(function(){
          this.runner.runBundler('foo',{src:'bar.js', requires: {}}, this.cb);
        });

        it('calls __applyRequires', function(){
          this.runner__applyRequires.called.should.equal(true);
        });
      });

      describe('are not included', function(){
        beforeEach(function(){
          this.runner.runBundler('foo',{src:'bar.js'}, this.cb);
        });

        it('does not call __applyRequires', function(){
          this.runner__applyRequires.called.should.not.equal(true);
        });
      });
    });
    
    describe('options.externals', function(){
      beforeEach(function(){
        this.runner__applyExternals = sinon.spy(this.runner, '__applyExternals');
      });

      afterEach(function(){
        this.runner__applyExternals.restore();
      });

      describe('are included', function(){
        beforeEach(function(){
          this.runner.runBundler('foo',{src:'bar.js', externals: {}}, this.cb);
        });

        it('calls __applyExternals', function(){
          this.runner__applyExternals.called.should.equal(true);
        });
      });

      describe('are not included', function(){
        beforeEach(function(){
          this.runner.runBundler('foo',{src:'bar.js'}, this.cb);
        });

        it('should not call __applyExternals', function(){
          this.runner__applyExternals.called.should.not.equal(true);
        });
      });
    });
    
    describe('options.ignores', function(){
      beforeEach(function(){
        this.runner__applyIgnores = sinon.spy(this.runner, '__applyIgnores');
      });

      afterEach(function(){
        this.runner__applyIgnores.restore();
      });

      describe('are included', function(){
        beforeEach(function(){
          this.runner.runBundler('foo',{src:'bar.js', ignores: {}}, this.cb);
        });

        it('calls __applyIgnores', function(){
          this.runner__applyIgnores.called.should.equal(true);
        });
      });

      describe('are not included', function(){
        beforeEach(function(){
          this.runner.runBundler('foo',{src:'bar.js'}, this.cb);
        });

        it('does not call __applyIgnores', function(){
          this.runner__applyIgnores.called.should.not.equal(true);
        });
      });
    });
    
    describe('options.excludes', function(){
      beforeEach(function(){
        this.runner__applyExcludes = sinon.spy(this.runner, '__applyExcludes');
      });

      afterEach(function(){
        this.runner__applyExcludes.restore();
      });

      describe('are included', function(){
        beforeEach(function(){
          this.runner.runBundler('foo',{src:'bar.js', excludes: {}}, this.cb);
        });

        it('calls __applyExcludes', function(){
          this.runner__applyExcludes.called.should.equal(true);
        });
      });

      describe('are not included', function(){
        beforeEach(function(){
          this.runner.runBundler('foo',{src:'bar.js'}, this.cb);
        });

        it('does not call __applyExcludes', function(){
          this.runner__applyExcludes.called.should.not.equal(true);
        });
      });
    });
  });
  describe('__applyTransforms', function(){
    beforeEach(function(){
      this.bundleInstance = {
        transform: sinon.spy()
      };
    });
    describe('with array of transforms', function(){
      beforeEach(function(){
        this.runner.__applyTransforms(this.bundleInstance, ['foo','bar','baz']);
      });
      it('calls bundleInstance.transform for each transform', function(){
        this.bundleInstance.transform.callCount.should.equal(3);
      });
    });
    describe('with transforms with options', function(){
      beforeEach(function(){
        this.runner.__applyTransforms(this.bundleInstance, [['foo', 'bar'], 'test']);
      });
      it('uses first element as transform name', function(){
        this.bundleInstance.transform.args[0][0].should.equal('foo');
        this.bundleInstance.transform.args[1][0].should.equal('test');
      });
      it('uses second element as transform options', function(){
        this.bundleInstance.transform.args[0][1].should.equal('bar');
      });
    });
  });
  
  describe('__applyRequires', function(){
    beforeEach(function(){
      this.bundleInstance = {
        require: sinon.spy()
      };
    });
    describe('with array of requires', function(){
      beforeEach(function(){
        this.runner.__applyRequires(this.bundleInstance, ['foo','bar','baz']);
      });
      it('calls bundleInstance.require for each require', function(){
        this.bundleInstance.require.callCount.should.equal(3);
      });
    });
  });

  describe('__applyExternals', function(){
    beforeEach(function(){
      this.bundleInstance = {
        external: sinon.spy()
      };
    });
    describe('with array of externals', function(){
      beforeEach(function(){
        this.runner.__applyExternals(this.bundleInstance, ['foo','bar','baz']);
      });
      it('calls bundleInstance.external for each require', function(){
        this.bundleInstance.external.callCount.should.equal(3);
      });
    });
  });

  describe('__applyIgnores', function(){
    beforeEach(function(){
      this.bundleInstance = {
        ignore: sinon.spy()
      };
    });
    describe('with array of ignores', function(){
      beforeEach(function(){
        this.runner.__applyIgnores(this.bundleInstance, ['foo','bar','baz']);
      });
      it('calls bundleInstance.ignore for each require', function(){
        this.bundleInstance.ignore.callCount.should.equal(3);
      });
    });
  });

  describe('__applyExcludes', function(){
    beforeEach(function(){
      this.bundleInstance = {
        exclude: sinon.spy()
      };
    });
    describe('with array of excludes', function(){
      beforeEach(function(){
        this.runner.__applyExcludes(this.bundleInstance, ['foo','bar','baz']);
      });
      it('calls bundleInstance.exclude for each require', function(){
        this.bundleInstance.exclude.callCount.should.equal(3);
      });
    });
  });
});
