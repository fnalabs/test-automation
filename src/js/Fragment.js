// imports
import chai from 'chai/should';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

// private property keys
const ELEMENTS = Symbol('ElementFinder Elements defined by CSS selectors');
const FRAGMENTS = Symbol('Fragments shared within current composition');


export default class Fragment {

    constructor(fragments) {
        this.expect = chai.expect;

        this[ELEMENTS] = new Map();

        this[FRAGMENTS] = fragments && Array.isArray(fragments) ? fragments : null;
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
            await Promise.all(this[FRAGMENTS].map((fragment) => fragment.testElements()));
        }
        await this.testExists();
    }

    async testExists() {
        await Promise.all(Array.from(this[ELEMENTS], (element) => {
            return this.expect(element.isPresent()).to.eventually.be.true;
        }));
    }
}
