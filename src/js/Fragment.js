import chai from 'chai/should';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

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
    testElements() {
        const promise = protractor.promise.fulfilled();

        if (this[FRAGMENTS]) {
            this[FRAGMENTS].forEach(fragment => promise.then(fragment.testElements()));
        }
        promise.then(this.testExists());

        return promise;
    }

    testExists() {
        const promise = protractor.promise.fulfilled();

        this[ELEMENTS].forEach(element => promise.then(this.expect(element).to.eventually.exist));

        return promise;
    }
}
