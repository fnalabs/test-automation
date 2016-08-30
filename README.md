# js-auto-test

The purpose of `js-auto-test` is to provide some scaffolding on top of [protractor](http://www.protractortest.org/) to follow the Page Object pattern for Automated UI tests. The Library contains some classes to help structure and automate your tests. The CLI provides a simple way to run tests with either the default [config](./config/config.js), environment variables, or override with your own config. There is also a simple example below.

## Library

The library consists of two main classes: [Fragment](./src/js/Fragment.js) and [Sequence](./src/js/Sequence.js).

A Fragment is any repeatable group of HTML that can be tested. For instance, a top level navigation bar is a repeatable group of HTML that could show up on many pages. It can be its own Fragment that can be associated with other Fragments. If you have non-repeatable content on the home page, you can make a home page Fragment that is associated with your navigation fragment above. The purpose of a Fragment is for testing its elements and optionally performing actions against its elements.

- **NOTE**: Action methods will need to be added per use case.

A Sequence defines the steps an automated UI test spec needs to perform. It is also responsible to setting the entry point to the test sequence. It provides a Fragment cache to reference for each step that needs to be defined.

### Example

Here is a simple example of an implementation using `js-auto-test`. A large site with many tests will benefit from the minimal suggested folder structure below.

- `./fragments/HomeFragment.js`

  ```javascript
  import { Fragment } from 'js-auto-test';

  const LINK_SELECTOR = 'a.link';

  export default class HomeFragment extends Fragment {
      constructor(fragments) {
          super(fragments);

          this.setElement(LINK_SELECTOR);
      }

      testElements() {
          const promise = super();

          promise.then(this.expect(this.getElement(LINK_SELECTOR).getText()).to.eventually.equal('some text'));

          return promise;
      }

      clickLink() {
          return this.getElement(LINK_SELECTOR).click();
      }
  }
  ```

- `./sequences/HomeSequence.js`

  ```javascript
  import { Sequence } from 'js-auto-test';

  import HomeFragment from '../fragments/HomeFragment';

  export default class HomeSequence extends Sequence {
      constructor() {
          super();

          this.setStep(() => this.getUrl('/'));
          this.setStep(() => this.setFragment('home', new HomeFragment()));
          this.setStep(() => this.getFragment('home').testElements());
          this.setStep(() => this.getFragment('home').clickLink());
      }
  }
  ```

- `./specs/home.spec.js`

  ```javascript
  import HomeSequence from '../sequences/HomeSequence';

  describe('home page test', () => {
      let homeSequence;

      before() {
          homeSequence = new HomeSequence();
      }

      it('expects to see "some text" on the home page', (done) => {
          homeSequence.runSequence()
            .then(done());
      });
  });
  ```

## CLI

The CLI is meant to provide an easy way to run the automated tests. By default it will run protractor with the default [config](./config/config.js), using any environment variables defined as an override. However, there are more configuration options that aren't as easily shimmed with environment variables, [test suites](http://www.protractortest.org/#/page-objects#configuring-test-suites) for example. For these cases and [more](https://github.com/angular/protractor/blob/master/docs/referenceConf.js), a custom config file can be created and the relative path must be passed as the only argument in the CLI call. Below are a few examples:

### Examples

- Normal use case

  ```
  $ js-auto-test
  ```

- Environment variable use case

  ```
  $ DIRECT_CONNECT=true js-auto-test
  ```

- Custom config use case

  ```
  $ js-auto-test ./path/to/config.js
  ```

## Environment variables

Below is a table describing the possible environment variable config overrides if desired. This option works great if using the standard setup within a Docker container.

Name                    | Type    | Default
----------------------- | ------- | --------------------------------
DIRECT_CONNECT          | Boolean | false
SELENIUM_URL            | String  | '<http://localhost:4444/wd/hub>'
TEST_BROWSER_NAME       | String  | 'phantomjs'
TEST_BROWSER_VERSION    | String  | 'ANY'
WEB_SERVER_DEFAULT_PORT | Number  | 8081
INTERACTIVE_TEST_PORT   | Number  | 6969
HTTP_PROTOCOL           | String  | 'http://'
HTTP_HOST               | String  | 'localhost'
HTTP_PORT               | String  |
TTP_HOST                | String  | 'localhost'
HTTP_PORT               | String  |
