/* global browser */
// imports
import Fragment from './Fragment'

// private property keys
const SEQUENCE_FRAGMENTS = Symbol('Fragments to reference for testing')
const STEPS = Symbol('Steps to perform in the order they are defined')

/**
 * Class representing a sequence of tests and actions to perform.
 * @example <caption>An example Sequence <a href="https://www.npmjs.com/package/test-automation#example">class</a> from the README. This Sequence creates a Fragment and sets some basic steps to load the Google homepage and check if the image loads.</caption>
 * import { GOOGLE_FRAGMENT } from '../constants'
 * import { Sequence } from 'test-automation'
 * import GoogleFragment from '../fragments/GoogleFragment'
 *
 * export default class GoogleSequence extends Sequence {
 *   constructor() {
 *     super()
 *
 *     this.setFragment(GOOGLE_FRAGMENT, new GoogleFragment())
 *
 *     this.setStep(() => this.getUrl('/'))
 *     this.setStep(this.getFragment(GOOGLE_FRAGMENT).testElements)
 *   }
 * }
 * @example <caption>A slightly more complex example Sequence <a href="https://github.com/fnalabs/test-automation-starter/blob/master/src/sequences/GoogleSequence.js">class</a> from the <a href="https://github.com/fnalabs/test-automation-starter">starter kit</a>. This Sequence creates multiple Fragments and sets many steps to fill out the Google search form, perform a search for `www.google.com`, land on the results page, and go back to the homepage.</caption>
 * import { FORM_SELECTOR, INPUT_SELECTOR, LINK_SELECTOR, GOOGLE_FRAGMENT, RESULT_FRAGMENT } from '../constants'
 * import { Sequence } from 'test-automation'
 *
 * import GoogleFragment from '../fragments/GoogleFragment'
 * import PageFragment from '../fragments/PageFragment'
 * import ResultFragment from '../fragments/ResultFragment'
 *
 * export default class GoogleSequence extends Sequence {
 *   constructor () {
 *     super()
 *
 *     const homepage = this.setFragment(GOOGLE_FRAGMENT, new PageFragment([new GoogleFragment()]))
 *     const resultpage = this.setFragment(RESULT_FRAGMENT, new ResultFragment())
 *
 *     this.setStep([
 *       () => this.getUrl('/'),
 *       () => homepage.testElements(),
 *       () => homepage.elementSendKeys(INPUT_SELECTOR, 'something'),
 *       () => homepage.elementClear(INPUT_SELECTOR),
 *       () => homepage.elementSendKeys(INPUT_SELECTOR, 'www.google.com'),
 *       () => homepage.elementSubmit(FORM_SELECTOR),
 *       () => resultpage.testElements(),
 *       () => resultpage.elementClick(LINK_SELECTOR),
 *       () => homepage.testElements()
 *     ])
 *   }
 * }
 */
class Sequence {
  constructor () {
    this[SEQUENCE_FRAGMENTS] = new Map()
    this[STEPS] = []
  }

  /**
   * Gets the Fragment referenced by the key passed.
   * @param {string|Symbol} key - The unique key associated with the Fragment.
   * @returns {Fragment} The associated fragment.
   */
  getFragment (key) {
    if (!key || !(/^string|symbol$/.test(typeof key))) throw new TypeError('getFragment(key): key must be a populated String|Symbol')
    return this[SEQUENCE_FRAGMENTS].get(key)
  }

  /**
   * Sets the Fragment to be referenced by the key passed.
   * @param {string|Symbol} key - The unique key associated with the Fragment.
   * @param {Fragment} fragment - The Fragment to associate with the key.
   * @returns {Fragment} The associated fragment.
   */
  setFragment (key, fragment) {
    if (!key || !(/^string|symbol$/.test(typeof key))) throw new TypeError('setFragment(key, fragment): key must be a populated String|Symbol')
    if (!(fragment instanceof Fragment)) throw new TypeError('setFragment(key, fragment): fragment must be a Fragment')
    this[SEQUENCE_FRAGMENTS].set(key, fragment)
    return fragment
  }

  /**
   * Sets a test step to be run, in order, during the test pass.
   * @param {Function|Array<Function>} step - The function that wraps a test or action.
   */
  setStep (step) {
    if (typeof step !== 'function' && !Array.isArray(step)) throw new TypeError('step must be a Function|Array')
    Array.isArray(step) ? this[STEPS].push(...step) : this[STEPS].push(step)
  }

  /**
   * [`async`] Getter method that gets the url specified to load in the browser.
   * @param {string} url - The relative url path to load.
   * @returns {Promise} The promise representing the browser get call.
   */
  async getUrl (url) {
    if (!url || typeof url !== 'string') throw new TypeError('getUrl(url): url must be a populated String')
    return browser.get(url)
  }

  /**
   * [`async`] Method that runs the sequence of test steps previously specified.
   * @returns {Promise} The promise chain of test steps.
   */
  async runSequence () {
    return this[STEPS].reduce((promise, step) => promise.then(step), Promise.resolve())
  }
}

export default Sequence
