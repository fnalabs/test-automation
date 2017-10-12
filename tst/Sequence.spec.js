/* eslint-env mocha */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import dirtyChai from 'dirty-chai'
import sinon from 'sinon'
import Fragment from '../src/Fragment'

chai.use(chaiAsPromised)
chai.use(dirtyChai)

describe('Sequence', () => {
  let Sequence, sequence

  beforeEach(() => {
    Sequence = require('../src/Sequence')
  })

  describe('#constructor', () => {
    it('should create a Sequence object w/o any child sequences', () => {
      sequence = new Sequence()

      expect(sequence).to.exist()
      expect(sequence.getFragment).to.be.a('function')
      expect(sequence.setFragment).to.be.a('function')
      expect(sequence.setStep).to.be.a('function')
      expect(sequence.getUrl).to.be.a('function')
      expect(sequence.runSequence).to.be.a('function')
    })
  })

  describe('#getFragment', () => {
    it('should get a stored element with a String key successfully', () => {
      sequence = new Sequence()
      sequence.setFragment('test', new Fragment())

      expect(sequence.getFragment('test')).to.be.an('object')
      expect(sequence.getFragment('test')).to.be.an.instanceof(Fragment)
    })

    it('should get a stored element with a Symbol key successfully', () => {
      const KEY = Symbol('key')
      sequence = new Sequence()
      sequence.setFragment(KEY, new Fragment())

      expect(sequence.getFragment(KEY)).to.be.an('object')
      expect(sequence.getFragment(KEY)).to.be.an.instanceof(Fragment)
    })

    it('should get undefined if an element doesn\'t exist', () => {
      sequence = new Sequence()

      expect(sequence.getFragment('test')).to.be.undefined()
    })

    it('should throw a TypeError since it was passed a falsy argument', () => {
      sequence = new Sequence()

      expect(sequence.getFragment).to.throw(TypeError)
    })

    it('should throw a TypeError since it was passed the wrong type of argument', () => {
      sequence = new Sequence()

      expect(() => sequence.getFragment(9)).to.throw(TypeError)
    })
  })

  describe('#setFragment', () => {
    it('should throw a TypeError since it was passed a falsy selector argument', () => {
      sequence = new Sequence()

      expect(sequence.setFragment).to.throw(TypeError, /String/)
    })

    it('should throw a TypeError since it was passed the wrong type of selector argument', () => {
      sequence = new Sequence()

      expect(() => sequence.setFragment(9)).to.throw(TypeError, /String/)
    })

    it('should throw a TypeError since it was passed the wrong type of fragment argument', () => {
      sequence = new Sequence()

      expect(() => sequence.setFragment('test')).to.throw(TypeError, /Fragment/)
    })
  })

  describe('#setStep', () => {
    it('should throw a TypeError since it was passed a falsy argument', () => {
      sequence = new Sequence()

      expect(sequence.setStep).to.throw(TypeError)
    })

    it('should throw a TypeError since it was passed the wrong type of argument', () => {
      sequence = new Sequence()

      expect(() => sequence.setStep(9)).to.throw(TypeError)
    })
  })

  describe('#getUrl', () => {
    beforeEach(() => {
      global.browser = { get: sinon.stub().resolves() }
    })

    it('should attempt to get the url provided', async () => {
      sequence = new Sequence()

      await expect(sequence.getUrl('/')).to.be.fulfilled()
      expect(global.browser.get.calledOnce).to.be.true()
      expect(global.browser.get.calledWithExactly('/')).to.be.true()
    })

    it('should throw a TypeError since it was passed a falsy argument', async () => {
      sequence = new Sequence()

      await expect(sequence.getUrl()).to.be.rejected()
      expect(global.browser.get.called).to.be.false()
    })

    it('should throw a TypeError since it was passed the wrong type of argument', async () => {
      sequence = new Sequence()

      await expect(sequence.getUrl(9)).to.be.rejected()
      expect(global.browser.get.called).to.be.false()
    })

    afterEach(() => {
      global.browser = null
    })
  })

  describe('#runSequence', () => {
    it('should run the sequence provided successfully', async () => {
      sequence = new Sequence()
      sequence.setStep(() => {})

      await expect(sequence.runSequence()).to.be.fulfilled()
    })

    it('should be rejected if any of the tests in the sequence fail', async () => {
      const neverRunSpy = sinon.spy()
      sequence = new Sequence()
      sequence.setStep([
        () => { throw new Error() },
        () => neverRunSpy()
      ])

      await expect(sequence.runSequence()).to.be.rejected()
      expect(neverRunSpy.called).to.be.false()
    })
  })

  afterEach(() => {
    Sequence = null
    sequence = null
  })
})
