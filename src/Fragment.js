/* global $ $$ */
// imports
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import dirtyChai from 'dirty-chai'

chai.use(chaiAsPromised)
chai.use(dirtyChai)

// hash that contains valid element state test methods for the testState method
const STATE_HASH = { displayed: 'isDisplayed', enabled: 'isEnabled', selected: 'isSelected' }

// private property keys
const ELEMENTS = Symbol('ElementFinder Elements defined by CSS selectors')
const FRAGMENTS = Symbol('Fragments shared within current composition')

export default class Fragment {
  constructor (fragments) {
    this.expect = chai.expect

    this[ELEMENTS] = new Map()

    this[FRAGMENTS] = fragments && Array.isArray(fragments) ? fragments : null
  }

  /*
   * getter(s)/setter(s)
   */
  getElement (selector) {
    if (!selector || typeof selector !== 'string') throw new TypeError('getElement(selector): selector must be a populated String')

    const el = this[ELEMENTS].get(selector)
    if (!el) throw new ReferenceError('getElement(selector): element is undefined')
    return el
  }

  setElement (selector, all = false) {
    if (!selector || typeof selector !== 'string') throw new TypeError('setElement(selector): selector must be a populated String')
    const el = all ? $$(selector) : $(selector)
    this[ELEMENTS].set(selector, el)
    return el
  }

  /*
   * test method(s)
   */
  async testElements () {
    if (this[FRAGMENTS]) {
      await Promise.all(this[FRAGMENTS].map((fragment) => fragment.testElements()))
    }
    return this.testExists()
  }

  async testExists () {
    return Promise.all(Array.from(this[ELEMENTS], ([selector, element]) => {
      return this.expect(element.isPresent()).to.eventually.be.true()
    }))
  }

  async testText (selector, text) {
    if (!text || typeof text !== 'string') throw new TypeError('testText(selector, text): text must be a populated String')

    return this.expect(this.getElement(selector).getText()).to.eventually.equal(text)
  }

  async testState (selector, state) {
    if (!state || !state.length) throw new TypeError('testState(selector, state): state must be a populated String|Array')

    if (typeof state === 'string' && STATE_HASH[state]) {
      return this.expect(this.getElement(selector)[STATE_HASH[state]]()).to.eventually.be.true()
    }
    return Promise.all(state.map(value => this.testState(selector, value)))
  }

  async testAttribute (selector, attribute, text) {
    if (!attribute || typeof attribute !== 'string') throw new TypeError('testAttribute(selector, attribute, text): attribute must be a populated String')
    if (!text || typeof text !== 'string') throw new TypeError('testAttribute(selector, attribute, text): text must be a populated String')

    return this.expect(this.getElement(selector).getAttribute(attribute)).to.eventually.equal(text)
  }

  /*
   * action method(s)
   */
  async elementClear (selector) {
    return this.getElement(selector).clear()
  }

  async elementClick (selector) {
    return this.getElement(selector).click()
  }

  async elementSendKeys (selector, keys) {
    if (!keys || !keys.length) throw new TypeError('elementSendKeys(selector, keys): keys must be a populated String|Array')

    const el = this.getElement(selector)
    return Array.isArray(keys) ? el.sendKeys(...keys) : el.sendKeys(keys)
  }

  async elementSubmit (selector) {
    return this.getElement(selector).submit()
  }
}
