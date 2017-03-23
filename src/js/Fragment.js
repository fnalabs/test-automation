// imports
import chai from 'chai/should';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

// private property keys
const ELEMENTS = Symbol('elements');
const FRAGMENTS = Symbol('fragments');


export default class Fragment {

    constructor(fragments) {
        this.expect = chai.expect;

        this[ELEMENTS] = new Map();
        this[FRAGMENTS] = fragments;
    }

    /*
     * getter(s)/setter(s)
     */
    getElement(selector) {
        return this[ELEMENTS].get(selector);
    }

    setElement(selector) {
        this[ELEMENTS].set(selector, element(by.css(selector)));
    }

    /*
     * test method(s)
     */
    async testElements() {
        if (this[FRAGMENTS]) {
            for (let fragment of this[FRAGMENTS]) {
                await fragment.testEelements();
            }
        }
        return await this.testExists();
    }

    async testExists() {
        for (let el of this[ELEMENTS]) {
            await this.expect(el).to.eventually.exist;
        }

        return Promise.resolve();
    }
}
