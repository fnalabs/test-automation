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

/**
 * Class representing a group of related HTML elements to test and perform actions against.
 * @param {Array<Fragment>} [fragments] - Optionally nested fragments that can be grouped hierarchically.
 * @example <caption>An example Fragment <a href="https://www.npmjs.com/package/test-automation#example">class</a> from the README. This Fragment sets an associated HTML element when instantiated and performs the default tests to ensure the image is on the page. It is used in the example Sequence below.</caption>
 * import { IMG_SELECTOR } from '../constants'
 * import { Fragment } from 'test-automation'
 *
 * export default class GoogleFragment extends Fragment {
 *   constructor(fragments) {
 *     super(fragments)
 *     this.setElement(IMG_SELECTOR)
 *   }
 * }
 * @example <caption>A slightly more complex example Fragment <a href="https://github.com/fnalabs/test-automation-starter/blob/master/src/fragments/PageFragment.js">class</a> from the <a href="https://github.com/fnalabs/test-automation-starter">starter kit</a>. This Fragment is responsible for the Google search form. It overrides the `testElements` method to perform the default tests and also perform each of the remaining tests: `testText`, `testAttribute`, and `testState`.</caption>
 * import { TERMS_SELECTOR, FORM_SELECTOR, INPUT_SELECTOR } from '../constants'
 * import { Fragment } from 'test-automation'
 *
 * export default class PageFragment extends Fragment {
 *   constructor (fragments) {
 *     super(fragments)
 *
 *     this.setElement(TERMS_SELECTOR)
 *     this.setElement(FORM_SELECTOR)
 *     this.setElement(INPUT_SELECTOR)
 *   }
 *
 *   async testElements () {
 *     await super.testElements()
 *
 *     await this.testText(TERMS_SELECTOR, 'Terms')
 *     await this.testAttribute(INPUT_SELECTOR, 'type', 'text')
 *     await this.testState(INPUT_SELECTOR, ['displayed', 'enabled'])
 *   }
 * }
 */
export default class Fragment {
  constructor (fragments) {
    this.expect = chai.expect

    this[ELEMENTS] = new Map()

    this[FRAGMENTS] = fragments && Array.isArray(fragments) ? fragments : null
  }

  /**
   * Gets the HTML element(s) referenced by the selector passed.
   * @param {string} selector - The CSS selector associated with the HTML element(s).
   * @returns {Object} The associated HTML element(s).
   */
  getElement (selector) {
    if (!selector || typeof selector !== 'string') throw new TypeError('getElement(selector): selector must be a populated String')

    const el = this[ELEMENTS].get(selector)
    if (!el) throw new ReferenceError('getElement(selector): element is undefined')
    return el
  }

  /**
   * Sets the HTML element(s) referenced by the selector passed.
   * @param {string} selector - The CSS selector associated with the HTML element(s).
   * @param {boolean} [all=false] - The optional parameter to specify whether to select all matching HTML elements.
   * @returns {Object} The associated HTML element(s).
   */
  setElement (selector, all = false) {
    if (!selector || typeof selector !== 'string') throw new TypeError('setElement(selector): selector must be a populated String')
    const el = all ? $$(selector) : $(selector)
    this[ELEMENTS].set(selector, el)
    return el
  }

  /**
   * [`async`] Test method that provides the minimal test pass capabilities, which are calling `testElements` on all of its associated Fragments and checking if all of its associated HTML elements exist. This should be overridden by classes extending Fragment to define the desired tests on your Fragment.
   * @returns {Promise} The results of the `testExists` method.
   */
  async testElements () {
    if (this[FRAGMENTS]) {
      await Promise.all(this[FRAGMENTS].map((fragment) => fragment.testElements()))
    }
    return this.testExists()
  }

  /**
   * [`async`] Test method that checks for the existence of all the HTML elements associated with the Fragment.
   * @returns {Promise} The results of all the `isPresent` assertions on HTML elements.
   */
  async testExists () {
    return Promise.all(Array.from(this[ELEMENTS], ([selector, element]) => {
      return this.expect(element.isPresent()).to.eventually.be.true()
    }))
  }

  /**
   * [`async`] Test method that tests the text value of an associated HTML element.
   * @param {string} selector - The CSS selector associated with the desired HTML element to test.
   * @param {string} text - The text to test the HTML element's content against.
   * @returns {Promise} The results of the test text assertion.
   */
  async testText (selector, text) {
    if (!text || typeof text !== 'string') throw new TypeError('testText(selector, text): text must be a populated String')

    return this.expect(this.getElement(selector).getText()).to.eventually.equal(text)
  }

  /**
   * [`async`] Test method that tests the state of an associated HTML element.
   * @param {string} selector - The CSS selector associated with the desired HTML element to test.
   * @param {string|Array<string>} state - The desired states you wish to test. Currently, the supported states are: `displayed`, `enabled`, and `selected`.
   * @returns {Promise} The results of the test state assertion(s).
   */
  async testState (selector, state) {
    if (!state || !state.length) throw new TypeError('testState(selector, state): state must be a populated String|Array')

    if (typeof state === 'string' && STATE_HASH[state]) {
      return this.expect(this.getElement(selector)[STATE_HASH[state]]()).to.eventually.be.true()
    }
    return Promise.all(state.map(value => this.testState(selector, value)))
  }

  /**
   * [`async`] Test method that tests the desired attribute of an associated HTML element.
   * @param {string} selector - The CSS selector associated with the desired HTML element to test.
   * @param {string} attribute - The desired HTML attribute you want to test.
   * @param {string} text - The expected text to test against the HTML attribute.
   * @returns {Promise} The results of the test attribute assertion.
   */
  async testAttribute (selector, attribute, text) {
    if (!attribute || typeof attribute !== 'string') throw new TypeError('testAttribute(selector, attribute, text): attribute must be a populated String')
    if (!text || typeof text !== 'string') throw new TypeError('testAttribute(selector, attribute, text): text must be a populated String')

    return this.expect(this.getElement(selector).getAttribute(attribute)).to.eventually.equal(text)
  }

  /**
   * [`async`] Action method used to clear the any value set on an associated HTML element.
   * @param {string} selector - The CSS selector associated with the desired HTML element to test.
   * @returns {Promise} The results of the `clear` method on the element.
   */
  async elementClear (selector) {
    return this.getElement(selector).clear()
  }

  /**
   * [`async`] Action method used to simulate a click on an associated HTML element.
   * @param {string} selector - The CSS selector associated with the desired HTML element to test.
   * @returns {Promise} The results of the `click` method on the element.
   */
  async elementClick (selector) {
    return this.getElement(selector).click()
  }

  /**
   * [`async`] Action method used to simulate keyboard user input on an associated HTML element.
   * @param {string} selector - The CSS selector associated with the desired HTML element to test.
   * @param {string|Array<string>} keys - The <a href="https://www.protractortest.org/#/api?view=webdriver.WebElement.prototype.sendKeys">keys</a> you wish to simulate.
   * @returns {Promise} The results of the `sendKeys` method on the element.
   */
  async elementSendKeys (selector, keys) {
    if (!keys || !keys.length) throw new TypeError('elementSendKeys(selector, keys): keys must be a populated String|Array')

    const el = this.getElement(selector)
    return Array.isArray(keys) ? el.sendKeys(...keys) : el.sendKeys(keys)
  }

  /**
   * [`async`] Action method used to simulate submitting an associated HTML form.
   * @param {string} selector - The CSS selector associated with the desired HTML element to test.
   * @returns {Promise} The results of the `submit` method on the element.
   */
  async elementSubmit (selector) {
    return this.getElement(selector).submit()
  }
}
