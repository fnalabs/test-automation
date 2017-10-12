/* global browser */
// imports
import Fragment from './Fragment'

// private property keys
const SEQUENCE_FRAGMENTS = Symbol('Fragments to reference for testing')
const STEPS = Symbol('Steps to perform in the order they are defined')

export default class Sequence {
  constructor () {
    this[SEQUENCE_FRAGMENTS] = new Map()
    this[STEPS] = []
  }

  /*
   * getter(s)/setter(s)
   */
  getFragment (key) {
    if (!key || !(/^string|symbol$/.test(typeof key))) throw new TypeError('getFragment(key): key must be a populated String|Symbol')
    return this[SEQUENCE_FRAGMENTS].get(key)
  }

  setFragment (key, fragment) {
    if (!key || !(/^string|symbol$/.test(typeof key))) throw new TypeError('setFragment(key, fragment): key must be a populated String|Symbol')
    if (!(fragment instanceof Fragment)) throw new TypeError('setFragment(key, fragment): fragment must be a Fragment')
    this[SEQUENCE_FRAGMENTS].set(key, fragment)
    return fragment
  }

  setStep (step) {
    if (typeof step !== 'function' && !Array.isArray(step)) throw new TypeError('step must be a Function|Array')
    Array.isArray(step) ? this[STEPS].push(...step) : this[STEPS].push(step)
  }

  async getUrl (url) {
    if (!url || typeof url !== 'string') throw new TypeError('getUrl(url): url must be a populated String')
    return browser.get(url)
  }

  /*
   * run method(s)
   */
  async runSequence () {
    return this[STEPS].reduce((promise, step) => promise.then(step), Promise.resolve())
  }
}
