// private property keys
const FRAGMENTS = Symbol('Fragments to reference for testing');
const STEPS = Symbol('Steps to perform in the order they are defined');


export default class Sequence {

    constructor() {
        this[FRAGMENTS] = new Map();
        this[STEPS] = [];
    }

    /*
     * getter(s)/setter(s)
     */
    getFragment(key) {
        return this[FRAGMENTS].get(key);
    }

    setFragment(key, fragment) {
        this[FRAGMENTS].set(key, fragment);
    }

    setStep(step) {
        this[STEPS].push(step);
    }

    async getUrl(url) {
        await browser.get(url);
    }

    /*
     * run method(s)
     */
    runSequence = async () => {
        await this[STEPS].reduce((promise, step) => promise.then(step()), Promise.resolve());
    }

}
