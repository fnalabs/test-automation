# test-automation

[![NPM Version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Build Status][circle-image]][circle-url]
[![Code Coverage][codecov-image]][codecov-url]
[![Dependency Status][depstat-image]][depstat-url]
[![JavaScript Style Guide][style-image]][style-url]

The purpose of `test-automation` is to provide some scaffolding on top of [protractor](http://www.protractortest.org/) to follow a Page Object pattern for Automated browser tests. The framework contains some classes to help structure and automate your tests. This is developed in parallel with the [test-automation-starter](https://github.com/fnalabs/test-automation-starter) kit as the framework the Docker implementation is built upon. The starter kit has more of a complete example than what is provided below. The intent of the project is to provide the necessary tools and a starting point to rapidly develop automated browser tests.

## What's new?
[Documentation](https://fnalabs.github.io/test-automation)!

#### Contents
- [Installing](#installing)
- [Framework](#framework)
  - [Fragment](#fragment)
  - [Sequence](#sequence)
  - [API](#api)
- [Example](#example)
  - [Code](#code)
  - [Config](#config)
- [Future](#future)
- [Changelog](#changelog)

## Installing
Install using `npm`:
```sh
$ npm install test-automation
```

## Framework
The framework consists of two main classes: [Fragment](./src/js/Fragment.js) and [Sequence](./src/js/Sequence.js).

### Fragment
A Fragment is the Page Object, a reusable group of HTML element references that can be tested. For instance, a top level navigation bar is a reusable group of HTML elements that could show up on many pages. It can be used as a shared Fragment component that can be associated with other Fragments. If you have unique content on the home page, you can make a home page Fragment that is associated with your navigation Fragment above. The purpose of a Fragment is for testing its elements and optionally performing actions against its elements.

Fragment provides basic testing functionality for getting/setting elements stored in a Map. It also provides some basic test methods to test any child fragments as well as check if the elements exist on the page. To perform more complex tests, extend the functionality of the class with additional test methods as needed. Don't forget to override [testElements](./src/js/Fragment.js#L87-L96) to call your new methods after calling `await super.testElements()` to run the provided test methods.
- ***NOTE:*** Elements must be defined on a Fragment object before any tests can occur.
- ***NOTE:*** Any additional action methods/classes will need to be added per use case, [requests](https://github.com/fnalabs/test-automation/issues) for common Actions are welcome. ([element api](http://www.protractortest.org/#/api?view=ElementFinder), [element.all api](http://www.protractortest.org/#/api?view=ElementArrayFinder))

### Sequence
A Sequence defines the steps an automated browser test specification needs to perform. It is also responsible to setting the entry point to the test sequence. It provides a Fragment cache to reference for each step in the sequence that will need to be defined.

I've started out with some basics and will be adding more over time (and open to [feature requests](https://github.com/fnalabs/test-automation/issues)).

### [API](https://fnalabs.github.io/test-automation)
Click on the link in the header above to go to the API page.

## Example
Here is a simple example of an implementation using `test-automation`. When testing a larger site with many tests, you will want to consider some structure around your code. I've added a suggested minimal folder structure below. I have also created a [starter kit](https://github.com/fnalabs/test-automation-starter) that contains a more advanced test than below with additional support scripts and environment/execution specifics.

#### Code
- `./constants.js`
  ```javascript
  // Selectors
  export const IMG_SELECTOR = '#hplogo'

  // Fragments
  export const GOOGLE_FRAGMENT = Symbol('google fragment')
  ```

- `./fragments/GoogleFragment.js`
  ```javascript
  import { IMG_SELECTOR } from '../constants'
  import { Fragment } from 'test-automation'

  export default class GoogleFragment extends Fragment {

    constructor(fragments) {
      super(fragments)

      this.setElement(IMG_SELECTOR)
    }

  }
  ```

- `./sequences/GoogleSequence.js`
  ```javascript
  import { GOOGLE_FRAGMENT } from '../constants'
  import { Sequence } from 'test-automation'
  import GoogleFragment from '../fragments/GoogleFragment'

  export default class GoogleSequence extends Sequence {

    constructor() {
      super()

      this.setFragment(GOOGLE_FRAGMENT, new GoogleFragment())

      this.setStep(() => this.getUrl('/'))
      this.setStep(this.getFragment(GOOGLE_FRAGMENT).testElements)
    }

  }
  ```

- `./specs/google.spec.js`
  ```javascript
  import GoogleSequence from '../sequences/GoogleSequence'
  browser.ignoreSynchronization = true

  describe('google homepage img test', () => {
    let googleSequence

    before(() => {
      googleSequence = new GoogleSequence()
    })

    it('expects img to exist on the google homepage', async () => {
      await googleSequence.runSequence()
    })

    after(() => {
      googleSequence = null
    })
  })
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
  }
  ```
  - ***NOTE:*** This configuration was used to run protractor on Linux Mint 18.1.

## Future
- feature requests via [issues](https://github.com/fnalabs/test-automation/issues)

## Changelog
#### v2.0.3
- added documentation

#### v2.0.2
- updated name, license, and organization
- updated dependencies

#### v2.0.1
- updated dependencies and configurations

#### v2.0.0
- added test methods on Fragment for common tests ([testText](#async-testtext-selector-text), [testState](#async-teststate-selector-state), [testAttribute](#async-testattribute-selector-attribute-text))
- added action methods on Fragment for common actions ([elementClear](#async-elementclear-selector), [elementClick](#async-elementclick-selector), [elementSendKeys](#async-elementsendkeys-selector-keys), and [elementSubmit](#async-elementsubmit-selector))
- updated Babel config to support native ES2017+ features
- updated dependencies
- removed Gulp

#### v1.0.0
- initial release

[npm-image]: https://img.shields.io/npm/v/test-automation.svg
[npm-url]: https://www.npmjs.com/package/test-automation

[license-image]: https://img.shields.io/badge/License-MIT-blue.svg
[license-url]: https://github.com/fnalabs/test-automation/blob/master/LICENSE

[circle-image]: https://img.shields.io/circleci/project/github/fnalabs/test-automation.svg
[circle-url]: https://circleci.com/gh/fnalabs/test-automation

[codecov-image]: https://img.shields.io/codecov/c/github/fnalabs/test-automation/master.svg
[codecov-url]: https://codecov.io/gh/fnalabs/test-automation

[depstat-image]: https://img.shields.io/david/fnalabs/test-automation.svg
[depstat-url]: https://david-dm.org/fnalabs/test-automation

[style-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[style-url]: https://standardjs.com
