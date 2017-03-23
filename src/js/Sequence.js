// private property keys
const FRAGMENTS = Symbol('fragments');
const STEPS = Symbol('fragments');


export default class Sequence {

    constructor() {
        this[FRAGMENTS] = new Map();
        this[STEPS] = new Set();
    }

    /*
     * getter(s)/setter(s)
     */
    getFragment(key) {
        return this[FRAGMENTS].get(key);
    }

    setFragment(key, object) {
        this[FRAGMENTS].set(key, object);
    }

    setStep(callback) {
        this[STEPS].set(callback);
    }

    getUrl(url) {
        return browser.get(url);
    }

    /*
     * run method(s)
     */
    async runSequence() {
        for (let step of this[STEPS]) {
            await step();
        }

        return await Promise.resolve();
    }

}
