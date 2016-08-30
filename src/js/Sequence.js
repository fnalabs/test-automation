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
        this[FRAGMENTS].get(key);
    }

    setFragment(key, object) {
        this[FRAGMENTS].set(key, object);
    }

    setStep(callback) {
        this[STEPS].set(callback);
    }

    getUrl(url) {
        browser.get(url);
    }

    /*
     * run method(s)
     */
    runSequence() {
        const promise = protractor.promise.fulfilled();

        this[STEPS].forEach(step => promise.then(step()));

        return promise;
    }

}
