# js-auto-test

[![NPM Version][npm-image]][npm-url]
[![Build Status][circle-image]][circle-url]
[![Code Coverage][codecov-image]][codecov-url]
[![Dependency Status][depstat-image]][depstat-url]
[![Dev Dependency Status][devdepstat-image]][devdepstat-url]
[![JavaScript Style Guide][style-image]][style-url]

The purpose of `js-auto-test` is to provide some scaffolding on top of [protractor](http://www.protractortest.org/) to follow a Page Object pattern for Automated UI tests. The Library contains some classes to help structure and automate your tests. This is developed in parallel with the [docker-auto-test-starter](https://github.com/aeilers/docker-auto-test-starter) kit as the library that the Docker implementation is built upon. The starter kit has more of a complete example than what is provided below.

## What's new?
v2 comes with many enhancements including:
- supporting the latest version of Node and ES2017+ without a babel transpile
- more functionality with more common test methods and action methods on Fragment
- added some type checking and unit tests

#### Contents
- [Library](#library)
  - [Fragment](#fragment)
  - [Sequence](#sequence)
  - [API](#api)
- [Example](#example)
  - [Code](#code)
  - [Config](#config)
- [Future](#future)

## Library
The library consists of two main classes: [Fragment](./src/js/Fragment.js) and [Sequence](./src/js/Sequence.js).

### Fragment
A Fragment is a reusable group of HTML element references that can be tested. For instance, a top level navigation bar is a reusable group of HTML elements that could show up on many pages. It can be used as a shared Fragment component that can be associated with other Fragments. If you have unique content on the home page, you can make a home page Fragment that is associated with your navigation Fragment above. The purpose of a Fragment is for testing its elements and optionally performing actions against its elements.

Fragment provides basic testing functionality for getting/setting elements stored in a Map. It also provides some basic test methods to test any child fragments as well as check if the elements exist on the page. To perform more complex tests, extend the functionality of the class with additional test methods as needed. Don't forget to override [testElements](./src/js/Fragment.js#L47) to call your new methods after calling `await super.testElements()` to run the provided test methods.
- ***NOTE:*** Elements must be defined on a Fragment object before any tests can occur.
- ***NOTE:*** Any additional action methods/classes will need to be added per use case, [requests](https://github.com/aeilers/js-auto-test/issues) for common Actions are welcome. ([element api](http://www.protractortest.org/#/api?view=ElementFinder), [element.all api](http://www.protractortest.org/#/api?view=ElementArrayFinder))

### Sequence
A Sequence defines the steps an automated UI test specification needs to perform. It is also responsible to setting the entry point to the test sequence. It provides a Fragment cache to reference for each step in the sequence that will need to be defined.

I've started out with some basics and will be adding more over time (and open to [feature requests](https://github.com/aeilers/js-auto-test/issues)).

### API
The information below provides more details on each objects' methods in the interim until I've integrated with a documentation generator.

#### Fragment
##### `getElement (selector)`
Gets the element stored in the Fragment's Map.
- params:
  - `selector` - `String` that represents the CSS selector for the element
- returns: Protractor `element` or `element.all`
```javascript
fragment.getElement('#test')
```

##### `setElement (selector, all = false)`
Sets the element to store in the Fragment's Map of elements.
- params:
  - `selector` - `String` that represents the CSS selector for the element
  - `all` - Truthy value to toggle selecting a single element if false or all elements if true
- returns: Protractor `element` or `element.all`
```javascript
fragment.setElement('#test')
fragment.setElement('#test .all', true)
```

##### `async testElements ()`
Invokes the tests for all elements defined in a Fragment and any child Fragments referenced in the original Fragment. By default it only tests if the elements exist on the page. This should be overridden to add any additional tests specific to the Fragment.
- returns: `Promise`
```javascript
fragment.testElements()
```

##### `async testExists ()`
Tests if all elements defined in a Fragment exist on the page. This is called in `testElements` above.
- returns: `Promise`
```javascript
fragment.testExists()
```

##### `async testText (selector, text)`
Tests the text of an element defined in a Fragment.
- params:
  - `selector` - `String` that represents the CSS selector for the element
  - `text` - `String` that represents the expected text of the element
- returns: `Promise`
```javascript
fragment.testText('#test', 'text')
```

##### `async testState (selector, state)`
Tests the state of an element defined in a Fragment.
- params:
  - `selector` - `String` that represents the CSS selector for the element
  - `state` - `String|Array` that represents the possible state(s) of the element
    - `displayed`
    - `enabled`
    - `selected`
- returns: `Promise`
```javascript
fragment.testState('#test', 'displayed')
fragment.testState('#test', ['displayed', 'enabled', 'selected'])
```

##### `async testAttribute (selector, attribute, text)`
Tests any attribute of an element defined in a Fragment.
- params:
  - `selector` - `String` that represents the CSS selector for the element
  - `attribute` - `String` that represents the attribute you want to test
  - `text` - `String` that represents the expected text of the element's attribute
- returns: `Promise`
```javascript
fragment.testAttribute('#test', 'type', 'text')
```

##### `async elementClear (selector)`
Clears any value set in a form text input element defined in a Fragment.
- params:
  - `selector` - `String` that represents the CSS selector for the element
- returns: `Promise`
```javascript
fragment.elementClear('#test')
```

##### `async elementClick (selector)`
Clicks an element defined in a Fragment.
- params:
  - `selector` - `String` that represents the CSS selector for the element
- returns: `Promise`
```javascript
fragment.elementClick('#test')
```

##### `async elementSendKeys (selector, keys)`
Sends keys to an element defined in a Fragment. This is useful for filling in form data or other complex keystrokes that a user may perform on a element.
- params:
  - `selector` - `String` that represents the CSS selector for the element
  - `keys` - `String|Array` that represents the desired keys to press
    - ***NOTE:*** refer to Protractor's [sendKeys](http://www.protractortest.org/#/api?view=webdriver.WebElement.prototype.sendKeys) documentation for more information on special keys.
- returns: `Promise`
```javascript
fragment.elementSendKeys('#test', 'some text')
```

##### `async elementSubmit (selector)`
Submits a form element defined in a Fragment.
- params:
  - `selector` - `String` that represents the CSS selector for the element
- returns: `Promise`
```javascript
fragment.elementSubmit('#test')
```

#### Sequence
##### `getFragment (key)`
Gets the fragment stored in the Sequence's Map.
- params:
  - `key` - `String|Symbol` that represents the fragment
- returns: `fragment`
```javascript
sequence.getFragment('test')
```

##### `setFragment (key, fragment)`
Sets the fragment to store in the Sequence's Map.
- params:
  - `key` - `String|Symbol` that represents the fragment
  - `fragment` - Fragment object
- returns: `fragment`
```javascript
sequence.setFragment('test', new Fragment())
```

##### `setStep (step)`
Sets the test steps to store in the Sequence's Array.
- params:
  - `step` - `Function|Array` to return an AsyncFunction that represents a test step
- returns: `undefined`
```javascript
sequence.setStep(() => sequence.getUrl('/'))
sequence.setStep([
  () => sequence.getUrl('/'),
  () => fragment.testElements(),
  () => fragment.elementClick('#testLink')
])
```

##### `async getUrl (url)`
Gets the page to test.
- params:
  - `url` - `String` that represents the relative or absolute URL of a page to test
- returns: `Promise`
```javascript
sequence.getUrl('/home')
```

##### `async runSequence ()`
Runs the array of steps defined in the Sequence.
- returns: `Promise`
```javascript
sequence.runSequence()
```

## Example
Here is a simple example of an implementation using `js-auto-test`. When testing a larger site with many tests, you will want to consider some structure around your code. I've added a suggested minimal folder structure below. I have also created a [starter kit](https://github.com/aeilers/docker-auto-test-starter) that contains a more advanced test than below with additional support scripts and environment/execution specifics.

#### Code
- `./constants.js`
  ```javascript
  // Selectors
  export const IMG_SELECTOR = '#hplogo';

  // Fragments
  export const GOOGLE_FRAGMENT = Symbol('google fragment');
  ```

- `./fragments/GoogleFragment.js`
  ```javascript
  import { IMG_SELECTOR } from '../constants';

  import { Fragment } from 'js-auto-test';


  export default class GoogleFragment extends Fragment {

    constructor(fragments) {
      super(fragments);

      this.setElement(IMG_SELECTOR);
    }

  }
  ```

- `./sequences/GoogleSequence.js`
  ```javascript
  import { GOOGLE_FRAGMENT } from '../constants';

  import { Sequence } from 'js-auto-test';

  import GoogleFragment from '../fragments/GoogleFragment';


  export default class GoogleSequence extends Sequence {

    constructor() {
      super();

      this.setFragment(GOOGLE_FRAGMENT, new GoogleFragment());

      this.setStep(() => this.getUrl('/'));
      this.setStep(this.getFragment(GOOGLE_FRAGMENT).testElements);
    }

  }
  ```

- `./specs/google.spec.js`
  ```javascript
  import GoogleSequence from '../sequences/GoogleSequence';

  browser.ignoreSynchronization = true;


  describe('google homepage img test', () => {
    let googleSequence;

    before(() => {
      googleSequence = new GoogleSequence();
    });

    it('expects img to exist on the google homepage', async () => {
      await googleSequence.runSequence();
    });

    after(() => {
      googleSequence = null;
    });
  });
  ```

#### Config
- `./conf/config.js`
  ```javascript
  exports.config = {
    directConnect: true,
    capabilities: {
      browserName: 'chrome',
      platform: 'ANY',
      version: ''
    },
    baseUrl: 'https://www.google.com',
    framework: 'mocha',
    mochaOpts: {
      reporter: 'spec',
      timeout: 5000
    },
    specs: ['../dist/**/*spec.js']
  };
  ```
  - ***NOTE:*** This configuration was used to run protractor on Linux Mint 18.1.

## Future
- integrate with documentation generators!
- feature requests via [issues](https://github.com/aeilers/js-auto-test/issues)

[npm-image]: https://img.shields.io/npm/v/js-auto-test.svg
[npm-url]: https://www.npmjs.com/package/js-auto-test

[circle-image]: https://img.shields.io/circleci/project/github/aeilers/js-auto-test.svg
[circle-url]: https://circleci.com/gh/aeilers/js-auto-test

[codecov-image]: https://img.shields.io/codecov/c/github/aeilers/js-auto-test.svg
[codecov-url]: https://codecov.io/gh/aeilers/js-auto-test

[depstat-image]: https://img.shields.io/david/aeilers/js-auto-test.svg
[depstat-url]: https://david-dm.org/aeilers/js-auto-test

[devdepstat-image]: https://img.shields.io/david/dev/aeilers/js-auto-test.svg
[devdepstat-url]: https://david-dm.org/aeilers/js-auto-test?type=dev

[style-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[style-url]: https://standardjs.com
