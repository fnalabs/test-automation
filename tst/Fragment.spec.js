/* eslint-env mocha */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import dirtyChai from 'dirty-chai'
import sinon from 'sinon'

chai.use(chaiAsPromised)
chai.use(dirtyChai)

describe('Fragment', () => {
  let Fragment, fragment

  beforeEach(() => {
    Fragment = require('../src/Fragment')
  })

  describe('#constructor', () => {
    it('should create a Fragment object w/o any child fragments', () => {
      fragment = new Fragment()
      console.log(fragment.constructor.name)

      expect(fragment).to.exist()
      expect(fragment).to.be.an.instanceof(Fragment)
      expect(fragment.constructor.name).to.equal('Fragment')

      expect(fragment.getElement).to.be.a('function')
      expect(fragment.setElement).to.be.a('function')
      expect(fragment.testElements).to.be.a('function')
      expect(fragment.testExists).to.be.a('function')
      expect(fragment.testText).to.be.a('function')
      expect(fragment.testState).to.be.a('function')
      expect(fragment.testAttribute).to.be.a('function')
      expect(fragment.elementClear).to.be.a('function')
      expect(fragment.elementClick).to.be.a('function')
      expect(fragment.elementSendKeys).to.be.a('function')
      expect(fragment.elementSubmit).to.be.a('function')
    })

    it('should create a Fragment object w/ child fragments', () => {
      fragment = new Fragment([new Fragment()])

      expect(fragment).to.exist()
    })
  })

  describe('#getElement', () => {
    beforeEach(() => {
      global.$ = () => ({ one: true })
    })

    it('should get a stored element successfully', () => {
      fragment = new Fragment()
      fragment.setElement('#test')

      expect(fragment.getElement('#test')).to.be.an('object')
      expect(fragment.getElement('#test')).to.deep.equal({ one: true })
    })

    it('should throw a ReferenceError if an element doesn\'t exist', () => {
      fragment = new Fragment()

      expect(() => fragment.getElement('#test')).to.throw(ReferenceError)
    })

    it('should throw a TypeError since it was passed a falsy argument', () => {
      fragment = new Fragment()

      expect(fragment.getElement).to.throw(TypeError)
    })

    it('should throw a TypeError since it was passed the wrong type of argument', () => {
      fragment = new Fragment()

      expect(() => fragment.getElement(9)).to.throw(TypeError)
    })

    afterEach(() => {
      global.$ = null
    })
  })

  describe('#setElement', () => {
    beforeEach(() => {
      global.$$ = () => ({ all: true })
    })

    it('should set all elements successfully', () => {
      fragment = new Fragment()
      fragment.setElement('#test .all', true)

      expect(fragment.getElement('#test .all')).to.be.an('object')
      expect(fragment.getElement('#test .all')).to.deep.equal({ all: true })
    })

    it('should throw a TypeError since it was passed a falsy argument', () => {
      fragment = new Fragment()

      expect(fragment.setElement).to.throw(TypeError)
    })

    it('should throw a TypeError since it was passed the wrong type of argument', () => {
      fragment = new Fragment()

      expect(() => fragment.setElement(9)).to.throw(TypeError)
    })

    afterEach(() => {
      global.$$ = null
    })
  })

  /*
   * test method tests
   */
  describe('#testElements', () => {
    context('when successful', () => {
      it('should test elements of a Fragment object w/o any child fragments', async () => {
        fragment = new Fragment()
        fragment.testExists = sinon.stub().resolves()

        await expect(fragment.testElements()).to.be.fulfilled()
        expect(fragment.testExists.calledOnce).to.be.true()
      })

      it('should test elements of a Fragment object w/ child fragments', async () => {
        const childFragment = new Fragment()
        childFragment.testExists = sinon.stub().resolves()

        fragment = new Fragment([childFragment])
        fragment.testExists = sinon.stub().resolves()

        await expect(fragment.testElements()).to.be.fulfilled()
        expect(childFragment.testExists.calledOnce).to.be.true()
        expect(fragment.testExists.calledOnce).to.be.true()
      })
    })

    context('when unsuccessful', () => {
      it('should return a promise in a rejected state when test elements error', async () => {
        fragment = new Fragment()
        fragment.testExists = sinon.stub().rejects()

        await expect(fragment.testElements()).to.be.rejected()
        expect(fragment.testExists.calledOnce).to.be.true()
      })
    })
  })

  describe('#testExists', () => {
    let isPresentStub

    context('when successful', () => {
      beforeEach(() => {
        isPresentStub = sinon.stub().resolves(true)
        global.$ = () => ({ isPresent: async () => isPresentStub() })
      })

      it('should test the existence of an element successfully', async () => {
        fragment = new Fragment()
        fragment.setElement('#test')

        await expect(fragment.testExists()).to.be.fulfilled()
        expect(isPresentStub.calledOnce).to.be.true()
      })

      it('should test successfully if no elements have been set', async () => {
        fragment = new Fragment()

        await expect(fragment.testExists()).to.be.fulfilled()
        expect(isPresentStub.called).to.be.false()
      })
    })

    context('when unsuccessful', () => {
      beforeEach(() => {
        isPresentStub = sinon.stub().rejects()
        global.$ = () => ({ isPresent: async () => isPresentStub() })
      })

      it('should test the existence of an element unsuccessfully', async () => {
        fragment = new Fragment()
        fragment.setElement('#test')

        await expect(fragment.testExists()).to.be.rejected()
        expect(isPresentStub.calledOnce).to.be.true()
      })
    })

    afterEach(() => {
      global.$ = null
      isPresentStub = null
    })
  })

  describe('#testText', () => {
    let getTextStub

    beforeEach(() => {
      getTextStub = sinon.stub().resolves('text')
      global.$ = () => ({ getText: async () => getTextStub() })
    })

    it('should test the text of an element successfully', async () => {
      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.testText('#test', 'text')).to.be.fulfilled()
      expect(getTextStub.calledOnce).to.be.true()
    })

    it('should be rejected if the text to test is not equal', async () => {
      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.testText('#test', 'test')).to.be.rejected()
      expect(getTextStub.calledOnce).to.be.true()
    })

    it('should be rejected if the text to test is not truthy', async () => {
      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.testText('#test')).to.be.rejected()
      expect(getTextStub.called).to.be.false()
    })

    it('should be rejected if the text to test is not a String', async () => {
      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.testText('#test', 9)).to.be.rejected()
      expect(getTextStub.called).to.be.false()
    })

    afterEach(() => {
      global.$ = null
      getTextStub = null
    })
  })

  describe('#testState', () => {
    let isDisplayedStub, isEnabledStub, isSelectedStub

    context('when successful', () => {
      beforeEach(() => {
        isDisplayedStub = sinon.stub().resolves(true)
        isEnabledStub = sinon.stub().resolves(true)
        isSelectedStub = sinon.stub().resolves(true)
        global.$ = () => {
          return {
            isDisplayed: async () => isDisplayedStub(),
            isEnabled: async () => isEnabledStub(),
            isSelected: async () => isSelectedStub()
          }
        }
      })

      it('should check if an element is displayed successfully', async () => {
        fragment = new Fragment()
        fragment.setElement('#test')

        await expect(fragment.testState('#test', 'displayed')).to.be.fulfilled()
        expect(isDisplayedStub.calledOnce).to.be.true()
        expect(isEnabledStub.called).to.be.false()
        expect(isSelectedStub.called).to.be.false()
      })

      it('should check if an element is enabled successfully', async () => {
        fragment = new Fragment()
        fragment.setElement('#test')

        await expect(fragment.testState('#test', 'enabled')).to.be.fulfilled()
        expect(isDisplayedStub.called).to.be.false()
        expect(isEnabledStub.calledOnce).to.be.true()
        expect(isSelectedStub.called).to.be.false()
      })

      it('should check if an element is selected successfully', async () => {
        fragment = new Fragment()
        fragment.setElement('#test')

        await expect(fragment.testState('#test', 'selected')).to.be.fulfilled()
        expect(isDisplayedStub.called).to.be.false()
        expect(isEnabledStub.called).to.be.false()
        expect(isSelectedStub.calledOnce).to.be.true()
      })

      it('should check if an element is displayed and enabled successfully', async () => {
        fragment = new Fragment()
        fragment.setElement('#test')

        await expect(fragment.testState('#test', ['displayed', 'enabled'])).to.be.fulfilled()
        expect(isDisplayedStub.calledOnce).to.be.true()
        expect(isEnabledStub.calledOnce).to.be.true()
        expect(isSelectedStub.called).to.be.false()
      })

      it('should check if an element is displayed and selected successfully', async () => {
        fragment = new Fragment()
        fragment.setElement('#test')

        await expect(fragment.testState('#test', ['displayed', 'selected'])).to.be.fulfilled()
        expect(isDisplayedStub.calledOnce).to.be.true()
        expect(isEnabledStub.called).to.be.false()
        expect(isSelectedStub.calledOnce).to.be.true()
      })

      it('should check if an element is enabled and selected successfully', async () => {
        fragment = new Fragment()
        fragment.setElement('#test')

        await expect(fragment.testState('#test', ['enabled', 'selected'])).to.be.fulfilled()
        expect(isDisplayedStub.called).to.be.false()
        expect(isEnabledStub.calledOnce).to.be.true()
        expect(isSelectedStub.calledOnce).to.be.true()
      })

      it('should check if an element is displayed, enabled, and selected successfully', async () => {
        fragment = new Fragment()
        fragment.setElement('#test')

        await expect(fragment.testState('#test', ['displayed', 'enabled', 'selected'])).to.be.fulfilled()
        expect(isDisplayedStub.calledOnce).to.be.true()
        expect(isEnabledStub.calledOnce).to.be.true()
        expect(isSelectedStub.calledOnce).to.be.true()
      })
    })

    context('when unsuccessful', () => {
      beforeEach(() => {
        isDisplayedStub = sinon.stub().rejects()
        isEnabledStub = sinon.stub().rejects()
        isSelectedStub = sinon.stub().rejects()
        global.$ = () => {
          return {
            isDisplayed: async () => isDisplayedStub(),
            isEnabled: async () => isEnabledStub(),
            isSelected: async () => isSelectedStub()
          }
        }
      })

      it('should check if an element is displayed unsuccessfully', async () => {
        fragment = new Fragment()
        fragment.setElement('#test')

        await expect(fragment.testState('#test', 'displayed')).to.be.rejected()
        expect(isDisplayedStub.calledOnce).to.be.true()
        expect(isEnabledStub.called).to.be.false()
        expect(isSelectedStub.called).to.be.false()
      })

      it('should check if an element is enabled unsuccessfully', async () => {
        fragment = new Fragment()
        fragment.setElement('#test')

        await expect(fragment.testState('#test', 'enabled')).to.be.rejected()
        expect(isDisplayedStub.called).to.be.false()
        expect(isEnabledStub.calledOnce).to.be.true()
        expect(isSelectedStub.called).to.be.false()
      })

      it('should check if an element is selected unsuccessfully', async () => {
        fragment = new Fragment()
        fragment.setElement('#test')

        await expect(fragment.testState('#test', 'selected')).to.be.rejected()
        expect(isDisplayedStub.called).to.be.false()
        expect(isEnabledStub.called).to.be.false()
        expect(isSelectedStub.calledOnce).to.be.true()
      })

      it('should check if an element is displayed and enabled unsuccessfully', async () => {
        fragment = new Fragment()
        fragment.setElement('#test')

        await expect(fragment.testState('#test', ['displayed', 'enabled'])).to.be.rejected()
        expect(isDisplayedStub.calledOnce).to.be.true()
        expect(isEnabledStub.calledOnce).to.be.true()
        expect(isSelectedStub.called).to.be.false()
      })

      it('should check if an element is displayed and selected unsuccessfully', async () => {
        fragment = new Fragment()
        fragment.setElement('#test')

        await expect(fragment.testState('#test', ['displayed', 'selected'])).to.be.rejected()
        expect(isDisplayedStub.calledOnce).to.be.true()
        expect(isEnabledStub.called).to.be.false()
        expect(isSelectedStub.calledOnce).to.be.true()
      })

      it('should check if an element is enabled and selected unsuccessfully', async () => {
        fragment = new Fragment()
        fragment.setElement('#test')

        await expect(fragment.testState('#test', ['enabled', 'selected'])).to.be.rejected()
        expect(isDisplayedStub.called).to.be.false()
        expect(isEnabledStub.calledOnce).to.be.true()
        expect(isSelectedStub.calledOnce).to.be.true()
      })

      it('should check if an element is displayed, enabled, and selected unsuccessfully', async () => {
        fragment = new Fragment()
        fragment.setElement('#test')

        await expect(fragment.testState('#test', ['displayed', 'enabled', 'selected'])).to.be.rejected()
        expect(isDisplayedStub.calledOnce).to.be.true()
        expect(isEnabledStub.calledOnce).to.be.true()
        expect(isSelectedStub.calledOnce).to.be.true()
      })

      it('should be rejected if the state argument is falsy', async () => {
        fragment = new Fragment()
        fragment.setElement('#test')

        await expect(fragment.testState('#test')).to.be.rejected()
        expect(isDisplayedStub.called).to.be.false()
        expect(isEnabledStub.called).to.be.false()
        expect(isSelectedStub.called).to.be.false()
      })

      it('should be rejected if the state argument is not a String|Array', async () => {
        fragment = new Fragment()
        fragment.setElement('#test')

        await expect(fragment.testState('#test', 9)).to.be.rejected()
        expect(isDisplayedStub.called).to.be.false()
        expect(isEnabledStub.called).to.be.false()
        expect(isSelectedStub.called).to.be.false()
      })
    })

    afterEach(() => {
      global.$ = null
      isDisplayedStub = null
      isEnabledStub = null
      isSelectedStub = null
    })
  })

  describe('#testAttribute', () => {
    let getAttributeStub

    beforeEach(() => {
      getAttributeStub = sinon.stub().resolves('text')
      global.$ = () => ({ getAttribute: async (attr) => getAttributeStub(attr) })
    })

    it('should test the text of an element successfully', async () => {
      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.testAttribute('#test', 'class', 'text')).to.be.fulfilled()
      expect(getAttributeStub.calledOnce).to.be.true()
      expect(getAttributeStub.calledWithExactly('class')).to.be.true()
    })

    it('should be rejected if the text to test is not equal', async () => {
      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.testAttribute('#test', 'class', 'test')).to.be.rejected()
      expect(getAttributeStub.calledOnce).to.be.true()
      expect(getAttributeStub.calledWithExactly('class')).to.be.true()
    })

    it('should be rejected if the attribute to test is not truthy', async () => {
      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.testAttribute('#test')).to.be.rejected()
      expect(getAttributeStub.called).to.be.false()
    })

    it('should be rejected if the attribute to test is not a String', async () => {
      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.testAttribute('#test', 9)).to.be.rejected()
      expect(getAttributeStub.called).to.be.false()
    })

    it('should be rejected if the text to test is not truthy', async () => {
      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.testAttribute('#test', 'class')).to.be.rejected()
      expect(getAttributeStub.called).to.be.false()
    })

    it('should be rejected if the text to test is not a String', async () => {
      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.testAttribute('#test', 'class', 9)).to.be.rejected()
      expect(getAttributeStub.called).to.be.false()
    })

    afterEach(() => {
      global.$ = null
      getAttributeStub = null
    })
  })

  /*
   * action method test(s)
   */
  describe('#elementClear', () => {
    let clearStub

    it('should clear an element successfully', async () => {
      clearStub = sinon.stub().resolves()
      global.$ = () => ({ clear: async () => clearStub() })

      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.elementClear('#test')).to.be.fulfilled()
      expect(clearStub.calledOnce).to.be.true()
    })

    it('should clear an element unsuccessfully', async () => {
      clearStub = sinon.stub().rejects()
      global.$ = () => ({ clear: async () => clearStub() })

      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.elementClear('#test')).to.be.rejected()
      expect(clearStub.calledOnce).to.be.true()
    })

    afterEach(() => {
      global.$ = null
      clearStub = null
    })
  })

  describe('#elementClick', () => {
    let clickStub

    it('should click an element successfully', async () => {
      clickStub = sinon.stub().resolves()
      global.$ = () => ({ click: async () => clickStub() })

      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.elementClick('#test')).to.be.fulfilled()
      expect(clickStub.calledOnce).to.be.true()
    })

    it('should click an element unsuccessfully', async () => {
      clickStub = sinon.stub().rejects()
      global.$ = () => ({ click: async () => clickStub() })

      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.elementClick('#test')).to.be.rejected()
      expect(clickStub.calledOnce).to.be.true()
    })

    afterEach(() => {
      global.$ = null
      clickStub = null
    })
  })

  describe('#elementSendKeys', () => {
    let sendKeysStub

    it('should send a String of keys to an element successfully', async () => {
      sendKeysStub = sinon.stub().resolves()
      global.$ = () => ({ sendKeys: async (keys) => sendKeysStub(keys) })

      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.elementSendKeys('#test', 'text')).to.be.fulfilled()
      expect(sendKeysStub.calledOnce).to.be.true()
      expect(sendKeysStub.calledWithExactly('text')).to.be.true()
    })

    it('should send a String of keys to an element unsuccessfully', async () => {
      sendKeysStub = sinon.stub().rejects()
      global.$ = () => ({ sendKeys: async (keys) => sendKeysStub(keys) })

      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.elementSendKeys('#test', 'text')).to.be.rejected()
      expect(sendKeysStub.calledOnce).to.be.true()
      expect(sendKeysStub.calledWithExactly('text')).to.be.true()
    })

    it('should send an Array of keys to an element successfully', async () => {
      sendKeysStub = sinon.stub().resolves()
      global.$ = () => ({ sendKeys: async (...keys) => sendKeysStub(...keys) })

      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.elementSendKeys('#test', ['text', 'array'])).to.be.fulfilled()
      expect(sendKeysStub.calledOnce).to.be.true()
      expect(sendKeysStub.calledWithExactly('text', 'array')).to.be.true()
    })

    it('should send an Array of keys to an element unsuccessfully', async () => {
      sendKeysStub = sinon.stub().rejects()
      global.$ = () => ({ sendKeys: async (...keys) => sendKeysStub(...keys) })

      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.elementSendKeys('#test', ['text', 'array'])).to.be.rejected()
      expect(sendKeysStub.calledOnce).to.be.true()
      expect(sendKeysStub.calledWithExactly('text', 'array')).to.be.true()
    })

    it('should be rejected if the keys to send are not truthy', async () => {
      sendKeysStub = sinon.stub().resolves()
      global.$ = () => ({ sendKeys: async (keys) => sendKeysStub(keys) })

      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.elementSendKeys('#test')).to.be.rejected()
      expect(sendKeysStub.called).to.be.false()
    })

    it('should be rejected if the keys to send are a String|Array', async () => {
      sendKeysStub = sinon.stub().resolves()
      global.$ = () => ({ sendKeys: async (keys) => sendKeysStub(keys) })

      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.elementSendKeys('#test', 9)).to.be.rejected()
      expect(sendKeysStub.called).to.be.false()
    })

    afterEach(() => {
      global.$ = null
      sendKeysStub = null
    })
  })

  describe('#elementSubmit', () => {
    let submitStub

    it('should submit a form element successfully', async () => {
      submitStub = sinon.stub().resolves()
      global.$ = () => ({ submit: async () => submitStub() })

      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.elementSubmit('#test')).to.be.fulfilled()
      expect(submitStub.calledOnce).to.be.true()
    })

    it('should submit a form element unsuccessfully', async () => {
      submitStub = sinon.stub().rejects()
      global.$ = () => ({ submit: async () => submitStub() })

      fragment = new Fragment()
      fragment.setElement('#test')

      await expect(fragment.elementSubmit('#test')).to.be.rejected()
      expect(submitStub.calledOnce).to.be.true()
    })

    afterEach(() => {
      global.$ = null
      submitStub = null
    })
  })

  afterEach(() => {
    Fragment = null
    fragment = null
  })
})
